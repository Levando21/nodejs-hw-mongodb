import { isValidObjectId } from 'mongoose';
import createHttpError from 'http-errors';

export const IsValidId = (req, res, next) => {
  const { contactId } = req.params;
  if (!isValidObjectId(contactId)) {
    throw createHttpError(404, 'Bad Request');
  }

  next();
};
