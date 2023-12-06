import { createContext } from 'react';
import { io, Socket } from 'socket.io-client';

import jwtService from '@/services/JwtService';
import { API_URL } from '@/config/index';

const socketUrl = API_URL.toString().split('/api')[0];

export const retryConnect = (socket: Socket) => {
  setTimeout(() => {
    socket.io.opts.extraHeaders = {
      ...socket.io.opts.extraHeaders,
      Authorization: `Bearer ${jwtService.getToken()}`,
    };
    socket.connect();
  }, 500);
};

export const socket = io(socketUrl, {
  extraHeaders: {
    Authorization: `Bearer ${jwtService.getToken()}`,
  },
  autoConnect: false,
  withCredentials: true,
  reconnection: true,
  reconnectionDelay: 500,
});

export const WebSocketContext = createContext<Socket>(socket);

export const WebSocketProvider = WebSocketContext.Provider;
