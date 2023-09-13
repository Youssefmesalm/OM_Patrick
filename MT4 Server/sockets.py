import os
import socketio
# from dwx_client import tick_processor
from api.client import client
import json
from time import sleep
from threading import Thread
from os.path import join, exists
from traceback import print_exc
from random import random
from datetime import datetime, timedelta
from fastapi import FastAPI, BackgroundTasks
from api.client import client
import asyncio
from pydantic import BaseModel
from fastapi.encoders import jsonable_encoder
import jwt

sio_server = socketio.AsyncServer(
    async_mode='asgi',
    cors_allowed_origins=[]
)


sio_app = socketio.ASGIApp(
    socketio_server=sio_server,
    socketio_path='sockets'

)
class tick_processor():
    def __init__(self, MT4_directory_path, 
                 sleep_delay=0.05,             # 5 ms for time.sleep()
                 max_retry_command_seconds=10,  # retry to send the commend for 10 seconds if not successful. 
                 verbose=True
                 ):

        # if true, it will randomly try to open and close orders every few seconds. 
        self.open_test_trades = True

        self.last_open_time = datetime.utcnow()
        self.last_modification_time = datetime.utcnow()

        self.dwx = client(self, MT4_directory_path, sleep_delay, 
                              max_retry_command_seconds, verbose=verbose)
        sleep(1)

        self.dwx.start()
        
        # account information is stored in self.dwx.account_info.
        print("Account info:", self.dwx.account_info)

        # subscribe to tick data:
        #self.dwx.subscribe_symbols(['EURUSD', 'BTCUSD'])

        # subscribe to bar data:
        #self.dwx.subscribe_symbols_bar_data([['EURUSD', 'M15'], ['GBPJPY', 'M5'], ['AUDCAD', 'M1']])

        # request historic data:
        end = datetime.utcnow()
        start = end - timedelta(days=30)  # last 30 days
        #self.dwx.get_historic_data('EURUSD', 'D1', start.timestamp(), end.timestamp())
        #print(self.dwx.set_subscribed_symbols("EURUSD"))
    def on_tick(self, symbol, bid, ask):
        now = datetime.utcnow()
        # print('on_tick:', now, symbol, bid, ask)
        # print(self.dwx._last_market_data)


    def on_bar_data(self, symbol, time_frame, time, open_price, high, low, close_price, tick_volume):
        print('on_bar_data:', symbol, time_frame, datetime.utcnow(), time, open_price, high, low, close_price)

    
    def on_historic_data(self, symbol, time_frame, data):
        
        # you can also access the historic data via self.dwx.historic_data. 
        print('historic_data:', symbol, time_frame, f'{len(data)} bars')


    def on_message(self, message):

        if message['type'] == 'ERROR':
            sio_server.send('error',{"type":message['type'],"error_type":message['error_type'],"description":message['description']})
            print(message['type'], '|', message['error_type'], '|', message['description'])
        elif message['type'] == 'INFO':
            sio_server.send('info',{"type":message['type'],"message":message['message']})
            print(message['type'], '|', message['message'])

   # triggers when an order is added or removed, not when only modified. 
    def on_order_event(self):
        # sio_server.emit('order_event',{"orders":self.dwx.open_orders})
        print(f'on_order_event. open_orders: {len(self.dwx.open_orders)} open orders')
        # Add the following line to automatically send the message event to the React client
        # sio_server.send('order_event', {"text": "An order event has occurred."})



MT4_files_dir = 'C:/Users/zabst/AppData/Roaming/MetaQuotes/Terminal/98A82F92176B73A2100FCD1F8ABD7255/MQL4/Files/'
# get current directory
# MT4_files_dir = os.getcwd()
processor = tick_processor(MT4_files_dir)


# dwx = client(None, MT4_files_dir, 0.5, 10, True)
# dwx.start()


@sio_server.event
async def connect(sid, environ, auth):
    """AI is creating summary for connect
    Args:
        sid ([type]): [description]
        environ ([type]): [description]
        auth ([type]): [description]
        
    """
    print(f'{sid}: connected')

class Loginclass(BaseModel):
    username: str
    password: str

User={"username":"admin","password":"admin"}
SECRET_KEY = "cairocoders"
ACESS_TOKENE_EXPIRE_MINUTES = 800
@sio_server.event
async def info(sid,msg):  
    await sio_server.emit('info',{"Account" :processor.dwx.account_info,"orders":processor.dwx.open_orders},to=sid)
    # last 5 item of dwx.messages
    # await sio_server.emit('info',{"Account" :processor.dwx.account_info,"orders":processor.dwx.open_orders,"Notifications":processor.dwx.messages[-5:]},to=sid)
    last_items = dict(list(processor.dwx.messages.items())[-5:])
    return {"Account" :processor.dwx.account_info,"orders":processor.dwx.open_orders,"Notifications":last_items}
    

# # # send hello
@sio_server.event
async def hello(sid, msg):
    await sio_server.emit('hello', {'msg': 'Hello from server!'})


# // login
@sio_server.event
async def login(sid, message):
    """AI is creating summary for login

    Args:
        sid ([type]): [description]
        message ([type]): [description]
    """
    print(message)
    if(message["username"]==User["username"] and message["password"]==User["password"]):
        endcoded=jwt.encode({"username":message["username"],"password":message["password"]},"secret",algorithm="HS256")
        sio_server.emit('login',{"status": "success","token":endcoded})
        return({"status": "success","token":endcoded})
    else:
        sio_server.emit('login',{"status": "failed"})
        return({"status": "failed"})



@sio_server.event
async def disconnect(sid):
    """AI is creating summary for disconnect

    Args:
        sid ([type]): [description]
    """
    print(f'{sid}: disconnected')

#open_order
@sio_server.event
async def open_order(sid, message):
    """AI is creating summary for open_order

    Args:
        sid ([type]): [description]
        message ([type]): [description]
    """
    processor.dwx.subscribe_symbols([''])
    sio_server.on('open_order',processor.dwx.open_order(message['symbol'], message['type'], message['volume'], message['price'], message['sl'], message['tp'],"", message['comment'],0,message['index']))

#close_order
@sio_server.event
async def close_order(sid, message):
    """AI is creating summary for close_order

    Args:
        sid ([type]): [description]
        message ([type]): [description]
    """
    
    sio_server.on('close_order',processor.dwx.close_order(message['ticket']) )
    
#close_all_orders
@sio_server.event
async def close_all_orders(sid, message):
    """AI is creating summary for close_all_orders

    Args:
        sid ([type]): [description]
        message ([type]): [description]
    """
    
    sio_server.on('close_all_orders',processor.dwx.close_all_orders() )
#close order with magic number
@sio_server.event
async def close_order_by_magic(sid, message):
    """AI is creating summary for close_order_by_magic

    Args:
        sid ([type]): [description]
        message ([type]): [description]
    """
    
    sio_server.on('close_order_by_magic',processor.dwx.close_orders_by_magic(message['magic']) )

# get subscribed symbols
@sio_server.event
async def get_subscribed_symbols(sid, message):
    """AI is creating summary for get_subscribed_symbols

    Args:
        sid ([type]): [description]
        message ([type]): [description]
    """
    
    data = processor.dwx.get_subscribed_symbols()
    await sio_server.emit('get_subscribed_symbols',data, to=sid)
    return data
# get tabs
@sio_server.event
async def get_tabs(sid, message):
    """AI is creating summary for get_tabs

    Args:
        sid ([type]): [description]
        message ([type]): [description]
    """
    data = processor.dwx.get_tabs()
    await sio_server.emit('get_tabs',data, to=sid)
    return data
# update tabs
@sio_server.event
async def update_tabs(sid, message):
    """AI is creating summary for update_tabs

    Args:
        sid ([type]): [description]
        message ([type]): [description]
    """
    processor.dwx.set_tabs(message)
    
    await sio_server.emit('update_tabs',message, to=sid)

# Close all orders by symbol name 
@sio_server.event
async def close_all_orders_by_symbol(sid, message):
    """AI is creating summary for close_all_orders_by_symbol

    Args:
        sid ([type]): [description]
        message ([type]): [description]
    """
    processor.dwx.close_orders_by_symbol(message["symbol"])
    await sio_server.emit('close_all_orders_by_symbol',message, to=sid)
    return message
# last market data 
@sio_server.event
async def last_market_data(sid, message):
    """AI is creating summary for last_market_data

    Args:
        sid ([type]): [description]
        message ([type]): [description]
    """

    data = processor.dwx.market_data
    
    await sio_server.emit('last_market_data',data, to=sid)
    return data
#mark all read
@sio_server.event
async def mark_all_read(sid,message):
    """AI is creating summary for mark_all_read

    Args:
        sid ([type]): [description]
        message ([type]): [description]
    """
    processor.dwx.MarkAllRead()
    print("mark all read")
    await sio_server.emit('mark_all_read',message, to=sid)

