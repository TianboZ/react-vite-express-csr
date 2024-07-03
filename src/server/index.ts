import express from 'express';
import router from './router';
import { createServer } from 'http';
import cors from 'cors';

const { PORT = 3001 } = process.env;

const app = express();

// Middleware that parses json and looks at requests where the Content-Type header matches the type option.
app.use(express.json());
app.use(cors({ origin: '*' }));

// Serve API requests from the router
app.use('/api', router);

// Serve app production bundle
app.use(express.static('dist/app'));

// Handle client routing, return all requests to the app
app.get('*', (_req, res) => {
  res.send('<p>hello</p>');
});

const httpServer = createServer(app);

httpServer.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
