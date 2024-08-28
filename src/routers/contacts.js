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
import { checkUser } from '../middlewares/checkUsers.js';
import { upload } from '../middlewares/upload.js';
import { createContactSchema } from '../validation/contacts.js';
import { updateContactSchema } from '../validation/contacts.js';
import { authenticate } from '../middlewares/authenticate.js';
import { IsValidId } from '../middlewares/isValidId.js';

const contactsRouter = Router();

contactsRouter.use(authenticate);

contactsRouter.get('/', ctrlWrapper(getContactsController));
contactsRouter.get(
  '/:contactId',
  checkUser,
  IsValidId,
  ctrlWrapper(getContactByIdController),
);
contactsRouter.post(
  '/',
  upload.single('photo'),
  validateBody(createContactSchema),
  ctrlWrapper(createContactsController),
);
contactsRouter.delete(
  '/:contactId',
  checkUser,
  ctrlWrapper(deleteContactsController),
);
contactsRouter.patch(
  '/:contactId',
  upload.single('photo'),
  checkUser,
  validateBody(updateContactSchema),
  ctrlWrapper(updateContactsController),
);
export { contactsRouter };
