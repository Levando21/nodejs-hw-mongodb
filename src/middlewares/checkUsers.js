import createHttpError from 'http-errors';
import { ContactsCollection } from '../db/models/contacts.js';

export const checkUser = async (req, res, next) => {
  try {
    const { user } = req;
    const { contactId } = req.params;

    if (!user) {
      return next(createHttpError(401, 'Unauthorized: User not authenticated'));
    }

    if (!contactId) {
      return next(createHttpError(400, 'Bad Request: Contact ID is missing'));
    }

    const contact = await ContactsCollection.findOne({
      _id: contactId,
      userId: user._id,
    });

    if (!contact) {
      return next(
        createHttpError(
          403,
          'Forbidden: You do not have access to this contact',
        ),
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};
