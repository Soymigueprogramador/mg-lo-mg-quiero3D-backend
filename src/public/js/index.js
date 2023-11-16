import { Express } from "express";
import http from 'http';
import { io } from "socket.io-client";
import { Server } from 'socket.io';

const app = Express();
const httpServer = http.createServer(app);
const socketServer = new Server(httpServer);

app.locals.io = httpServer;

socketServer.emit('mensaje', 'Estamos conectados desde socket');