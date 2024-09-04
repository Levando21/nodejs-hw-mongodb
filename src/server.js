import express from 'express';

import cors from 'cors';
import pino from 'pino';
import pinoHttp from 'pino-http';

import { contactsRouter } from './routers/contacts.js';
import { authRouter } from './routers/auth.js';

import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import cookieParser from 'cookie-parser';
import { SMTP } from './constans/index.js';
import { UPLOAD_DIR } from './constans/index.js';
import { swaggerDocs } from './middlewares/swaggerDocs.js';

const logger = pino();
export default function setupServer() {
  const app = express();

  app.use(express.json());
  app.use(cookieParser());

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

  app.use('/contacts', contactsRouter);
  app.use('/auth', authRouter);
  app.use('/uploads', express.static(UPLOAD_DIR));
  app.use('/api-docs', swaggerDocs());

  app.use('*', notFoundHandler);

  app.use(errorHandler);

  app.listen(PORT, () =>
    console.log(`Server started at port ${PORT}, and SMTP is ON  ${SMTP.PORT}`),
  );
}
