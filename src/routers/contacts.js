import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  getContactsController,
  getContactByIdController,
  createContactsController,
  deleteContactsController,
  updateContactsController,
} from '../controllers/contacts.js';

const router = Router();

router.get('/contacts', ctrlWrapper(getContactsController));
router.get('/contacts/:contactId', ctrlWrapper(getContactByIdController));
router.post('/contacts', ctrlWrapper(createContactsController));
router.delete('/contacts/:contactId', ctrlWrapper(deleteContactsController));
router.patch(
  '/contacts/:contactId',

  ctrlWrapper(updateContactsController),
);
export default router;
