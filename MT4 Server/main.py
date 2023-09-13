import uvicorn
from fastapi import FastAPI
import jwt
from fastapi.middleware.cors import CORSMiddleware
from sockets import sio_app



def run_server():
    app = FastAPI()
    app.mount("/", sio_app)
        
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_methods=["*"],
        allow_headers=["*"],
    )

    uvicorn.run(app, host="0.0.0.0", port=8000)
if __name__ == "__main__":
    run_server()