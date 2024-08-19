import { contactsRouter } from './contacts.js';
import { authRouter } from './auth.js';
import { Router } from 'express';

const router = Router();
router.use(contactsRouter);
router.use(authRouter);

export default router;
