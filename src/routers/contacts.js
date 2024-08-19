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

import { createContactSchema } from '../validation /contacts.js';
import { updateContactSchema } from '../validation /contacts.js';
import { IsValidId } from '../middlewares/isValidId.js';

const router = Router();

router.get('/', ctrlWrapper(getContactsController));
router.get('/:contactId', IsValidId, ctrlWrapper(getContactByIdController));
router.post(
  '/register',
  validateBody(createContactSchema),
  ctrlWrapper(createContactsController),
);
router.delete('/:contactId', ctrlWrapper(deleteContactsController));
router.patch(
  '/:contactId',
  validateBody(updateContactSchema),
  ctrlWrapper(updateContactsController),
);
export default router;
