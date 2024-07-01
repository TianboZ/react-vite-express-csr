import express from 'express';
import router from './router';
import path from 'path';
import { createServer } from 'http'; // Import the http module
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
const server = createServer(app);

// Initialize Socket.IO with the HTTP server
const io = new SocketIOServer(server, {
  cors: {
    origin: '*', // Adjust the CORS settings as needed
  },
});

// Set up server-side event handlers
io.on('connection', (socket) => {
  console.log('A user connected');

  io.emit('message', 'broadcast');

  // Handle events
  socket.on('message', (msg) => {
    console.log('Message received:', msg);
    // Broadcast the message to all connected clients
    io.emit('message', msg);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });

  socket.emit('test', { a: 1 });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
