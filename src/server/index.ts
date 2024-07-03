import express from 'express';
import router from './router';
import path from 'path';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

const { PORT = 3001 } = process.env;

const app = express();

// Middleware that parses JSON and looks at requests where the Content-Type header matches the type option.
app.use(express.json());

// Serve API requests from the router
app.use('/api', router);

// Serve app production bundle
app.use(express.static('dist/app'));

// Handle client routing, return all requests to the app
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'dist/app/index.html'));
});

// Create an HTTP server
const httpServer = createServer(app);

// event naming format [domain:action]
export type Msg = {
  data: string;
  roomId: string;
  time: string;
  user: string;
};
export type ServerToClientEvents = {
  broadcast: (arg: string) => void;
  basicEmit: (a: number, b: string) => void;
  emtiWithAck: (a: string, cb: (err: any, arg: any) => void) => void;
  emitNoArg: () => void;
  // chat
  msg_receive: (data: Msg) => void;
};

export type ClientToServerEvents = {
  hello: (arg: string) => void;
  // chat
  msg_send: (arg: Msg) => void;
  room_join: (arg: string, cb: any) => void;
};

type InterServerEvents = {
  ping: () => void;
};

// Initialize Socket.IO with the HTTP server
const io = new SocketIOServer<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents
>(httpServer, {
  cors: {
    origin: '*', // Adjust the CORS settings as needed
  },
});

io.on('connection', (socket) => {
  console.log(
    'A user connected, socket id: ',
    socket.id,
    'socket headers: ',
    socket.request.headers
  );

  // broadcase
  io.emit('broadcast', 'boradcase message from server');

  // emit events
  socket.emit('basicEmit', Math.random() * 100, 'simple emit message');

  socket.emit('emtiWithAck', 'emtiWithAck event', (err, resp) => {
    console.log(err);
    console.log(resp);
  });

  socket.emit('emitNoArg');

  // receive events
  socket.on('hello', (arg1) => {
    console.log('hello event');
    console.log(arg1);
    // can broadcast here by using server instance, io
    // io.emit('broadcast',  'boradcase message from socket instance');
  });

  socket.on('msg_send', (data) => {
    console.log(data);
    // io.emit('msg_receive', data);
    io.to([data.roomId]).emit('msg_receive', data);
  });

  socket.on('room_join', (data, cb) => {
    console.log(
      'user id: ',
      socket.id,
      'join room id: ',
      data,
      'rooms',
      socket.rooms
    );
    socket.join(data);
    cb();
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected', socket.id);
  });
});

// Start the server
httpServer.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
