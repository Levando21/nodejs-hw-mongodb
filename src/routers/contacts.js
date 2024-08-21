import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  getContactsController,
  getContactByIdController,
  createContactsController,
  deleteContactsController,
  updateContactsController,
} from '../controllers/contacts.js';

import { validateBody } from '../middlewares/validateBody.js';

import { createContactSchema } from '../validation/contacts.js';
import { updateContactSchema } from '../validation/contacts.js';
import { IsValidId } from '../middlewares/isValidId.js';

const contactsRouter = Router();

contactsRouter.get('/', ctrlWrapper(getContactsController));
contactsRouter.get(
  '/:contactId',
  IsValidId,
  ctrlWrapper(getContactByIdController),
);
contactsRouter.post(
  '/',
  validateBody(createContactSchema),
  ctrlWrapper(createContactsController),
);
contactsRouter.delete('/:contactId', ctrlWrapper(deleteContactsController));
contactsRouter.patch(
  '/:contactId',
  validateBody(updateContactSchema),
  ctrlWrapper(updateContactsController),
);
export { contactsRouter };
