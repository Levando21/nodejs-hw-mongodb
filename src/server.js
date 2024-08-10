import express from 'express';

import cors from 'cors';
import pino from 'pino';
import pinoHttp from 'pino-http';

import router from './routers/contacts.js';

import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';

const logger = pino();
export default function setupServer() {
  const app = express();

  app.use(express.json());

  app.use(cors());
  app.use(pinoHttp({ logger }));
  const PORT = process.env.PORT || 3000;

  app.use((req, res, next) => {
    console.log({ Method: req.method });
    next();
  });

  app.get('/', (req, res) => {
    res.json({ message: 'It is response new one!!' });
  });

  app.use(router);

  app.use('*', notFoundHandler);

  app.use(errorHandler);

  app.listen(PORT, () => console.log(`Server started at port ${PORT}`));
}
