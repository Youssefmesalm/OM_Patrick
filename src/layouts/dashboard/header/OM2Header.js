import PropTypes from 'prop-types';
// @mui
import { useDispatch, useSelector } from 'react-redux';
import { styled } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import { Box, Stack, AppBar, Toolbar, IconButton, Chip, Button } from '@mui/material';
// import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
// utils
import { useEffect, useState } from 'react';
import { setSymbols, deleteSymbol } from '../../../Reducer/SymbolsReducer';
import { addSymboltoTab, deleteTabSymbol, updateTabSymbol, setAccount, setOrders, setTabs, setNotifications } from '../../../Reducer/TabsReduces';

import { bgBlur } from '../../../utils/cssStyles';
// components
import Iconify from '../../../components/iconify';
//
import Searchbar from './Searchbar';
import AccountPopover from './AccountPopover';
import LanguagePopover from './LanguagePopover';
import NotificationsPopover from './NotificationsPopover';
// ----------------------------------------------------------------------
import Socket from '../../../components/socket';
import ConfitmDialog from '../../../components/Dialog/Dialog';

const NAV_WIDTH = 280;

const HEADER_MOBILE = 64;

const HEADER_DESKTOP = 92;

const StyledRoot = styled(AppBar)(({ theme }) => ({
  ...bgBlur({ color: theme.palette.background.default }),
  boxShadow: 'none',
  [theme.breakpoints.up('lg')]: {
    width: "100%",
  },
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  minHeight: HEADER_MOBILE,
  [theme.breakpoints.up('lg')]: {
    minHeight: HEADER_DESKTOP,
    padding: theme.spacing(0, 5),
  },
}));

// ----------------------------------------------------------------------

OM2Header.propTypes = {
  onOpenNav: PropTypes.func,
};

export default function OM2Header({ onOpenNav, OpenNav }) {

  const dispatch = useDispatch();
  const [balance, setBalance] = useState(0);
  const [equity, setEquity] = useState(0);
  const [profit, setProfit] = useState(0);
  const tabs = useSelector((state) => state.tabs.tabs)
  const Orders = useSelector((state => state.tabs.orders))
  const state = useSelector((state) => state.tabs);
  useEffect(() => {
    // Socket connection
    Socket.on('connect', () => {
      console.log('connected');
    });
    Socket.emit('get_subscribed_symbols', {}, (data) => {
      // add symbol to symbol state
      const symbols = data.symbols.map((symbol) => symbol);
      dispatch(setSymbols(symbols));
    });
    setInterval(() => {
      Socket.emit('info', { account_id: 1 }, (data) => {
        console.log(data);
        if (balance !== data.Account.balance)
          setBalance(data.Account.balance);
        if (equity !== data.Account.equity)
          setEquity(data.Account.equity);
        if (profit !== data.Account.profit)
          setProfit(data.Account.profit)
        dispatch(setAccount(data.Account));
        dispatch(setOrders(data.orders));
        dispatch(setNotifications(data.Notifications));
      });

    }, 4000);


    // //Socket.emit('open_order', { account_id: 1, symbol: 'BTCUSD', volume: 0.01, type: 'buy' })\
  }, []);
  // let firstMount = true;
  useEffect(() => {
    Socket.emit('get_tabs', tabs, (data) => {
      if (data != null) {
        dispatch(setTabs(data));

      }
    })

  }, []) // added missing dependency here

  useEffect(() => {

    Socket.emit('update_tabs', state);
  }, [tabs]); // added missing dependency here
  const handleCloseAllOrders = (event) => {
    Socket.emit('close_all_orders', { account_id: 1 })
    dispatch(setOrders({}));
  }
  const HandleHedgeAll = (event) => {
    let lot;
    let type1;
    let stoploss;
    let BuysLot = 0;
    let SellsLot = 0;
    let Comment;
    Object.keys(Orders).map((symb) => {
      Object.keys(Orders[symb]).map((magicNumber) => {
        Object.keys(Orders[symb][magicNumber]).map((order) => {
          if (Orders[symb][magicNumber][order].comment.includes('PO') && Orders[symb][magicNumber][order].type !== "buy" && Orders[symb][magicNumber][order].type !== "sell") {
            Socket.emit('close_order', { ticket: order });
          }
          if (Orders[symb][magicNumber][order].type === "buy") {
            BuysLot += Orders[symb][magicNumber][order].lots;
            stoploss = Orders[symb][magicNumber][order].SL;
            Comment = Orders[symb][magicNumber][order].comment;
          }
          if (Orders[symb][magicNumber][order].type === "sell") {
            SellsLot += Orders[symb][magicNumber][order].lots;
            stoploss = Orders[symb][magicNumber][order].SL;
            Comment = Orders[symb][magicNumber][order].comment;
          }
          return null;
        })
        type1 = SellsLot > BuysLot ? "buy" : "sell";
        lot = SellsLot > BuysLot ? SellsLot - BuysLot : BuysLot - SellsLot;
        console.log(BuysLot, SellsLot, lot, type1, stoploss, Comment);
        Socket.emit('open_order', { account_id: 1, symbol: symb, volume: lot, type: type1, price: 0, sl: 0, tp: 0, comment: Comment, index: magicNumber });
        return null;
      })
      return null;
    })
  }
  const [open, setOpen] = useState(false);


  const handleClose = () => {
    setOpen(false);
    HandleHedgeAll();
  };

  const handleClickOpen = () => {
    setOpen(true);
  };
  return (
    <StyledRoot>
      <StyledToolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={onOpenNav}
          edge="start"
          sx={{
            marginRight: 5,
            ...(OpenNav && { display: 'none' }),
          }}
        >
          <MenuIcon />
        </IconButton>
        <IconButton
          onClick={onOpenNav}
          sx={{
            mr: 1,
            color: 'text.primary',

          }}
        >

          <Iconify icon="eva:menu-2-fill" />
        </IconButton>

        <Searchbar />
        <Box sx={{ flexGrow: 1 }} />

        <Stack
          direction="row"
          alignItems="center"
          spacing={{
            xs: 0.5,
            sm: 1,
          }}
        >
          {/* stack column */}
          <Stack direction="row" spacing={1}>

            <Button label="Hedge All" color='primary' variant="contained" onClick={handleClickOpen}  >Hedge All</Button>
            {/* <Button label="Close All" onClick={() => handleCloseAllOrders()} color='error' variant="contained" >Close All</Button> */}
            <Button onClick={() => window.open('/dashboard/HedgedOrders', '_blank', 'rel=noopener noreferrer')} label="Show OM" color='info' variant="contained" >Show OM2</Button>
          </Stack>
          <Stack direction="row" spacing={1}>

            <Button variant="outlined">Balance: ${balance}</Button>
            <Button variant="outlined">Equity: ${equity}</Button>
            <Button variant="outlined">Profit: ${profit}</Button>


          </Stack>

          <ConfitmDialog open={open} handleClose={handleClose} title="Hedge all" message="Did You really need to Hedge All" />
          <LanguagePopover />
          <NotificationsPopover />
          <AccountPopover />
        </Stack>
      </StyledToolbar>
    </StyledRoot>
  );
}
