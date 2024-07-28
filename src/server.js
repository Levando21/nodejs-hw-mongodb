import express from 'express';
import cors from 'cors';
import pino from 'pino';
import pinoHttp from 'pino-http';
import { ContactsCollection } from './db/models/contacts.js';

const logger = pino();
export default function setupServer() {
  const app = express();

  app.use(cors());
  app.use(pinoHttp({ logger }));
  const PORT = process.env.PORT || 3000;

  app.use((req, res, next) => {
    console.log({ Method: req.method });
    next();
  });

  app.get('/', (req, res) => {
    res.json({ message: 'It is response new one' });
  });

  app.get('/contacts', async (req, res) => {
    try {
      const contacts = await ContactsCollection.find();
      res.json({
        status: 200,
        message: 'Successfully found contacts!',
        data: contacts,
      });
    } catch (error) {
      logger.error(error);
      res.status(500).send({ status: 500, message: 'Internal Server Error' });
    }
  });

  app.get('/contacts/:contactId', async (req, res) => {
    const { contactId } = req.params;
    try {
      const contact = await ContactsCollection.findById(contactId);
      if (!contact) {
        return res
          .status(404)
          .send({ status: 404, message: 'Contact not found' });
      }
      res.json({
        status: 200,
        message: 'Successfully found contact!',
        data: contact,
      });
    } catch (error) {
      logger.error(error);
      res.status(500).send({ status: 500, message: 'Internal Server Error' });
    }
  });

  app.use((req, res, next) => {
    res.status(404).send({ status: 404, message: 'Not found' });
  });

  app.listen(PORT, () => console.log(`Server started at port ${PORT}`));
}
