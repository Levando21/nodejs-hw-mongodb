import { isValidObjectId } from 'mongoose';
import createHttpError from 'http-errors';

export const IsValidId = (req, res, next) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    throw createHttpError(404, 'Bad Request');
  }

  next();
};
