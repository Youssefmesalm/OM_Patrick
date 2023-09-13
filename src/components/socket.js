import { io } from 'socket.io-client';

const Socket = io('http://10.0.0.31:8000/', { path: '/sockets' }); // eslint-disable-next-line
export default Socket;