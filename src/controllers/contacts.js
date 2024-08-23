import {
  createContacts,
  getContacts,
  getContactById,
  deleteContact,
  updateContact,
} from '../services/contacts.js';
import createHttpError from 'http-errors';
import { parsePaginationData } from '../utils/parsePaginationData.js';
import { parseSortParams } from '../utils/parseSortParams.js';

export const getContactsController = async (req, res, next) => {
  const { page, perPage } = parsePaginationData(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const { _id: userId } = req.user;

  // Отримання контактів користувача
  const contacts = await getContacts({
    userId,
    page,
    perPage,
    sortBy,
    sortOrder,
  });

  if (!contacts) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully received all contacts!',
    data: contacts,
  });
};

export const getContactByIdController = async (req, res, next) => {
  const { contactId } = req.params;
  const { _id: userId } = req.user;

  const contact = await getContactById(contactId, userId);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully found contact!',
    data: contact,
  });
};

export const createContactsController = async (req, res, next) => {
  const { body } = req;
  const userId = req.user._id;
  const newContact = await createContacts(body, userId);

  if (!newContact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(201).json({
    status: 201,
    message: 'Successfully created contact!',
    data: newContact,
  });
};

export const deleteContactsController = async (req, res, next) => {
  const { contactId } = req.params;
  const { _id: userId } = req.user; // Отримання userId із запиту

  // Видалення контакту користувача за ID
  const contact = await deleteContact(contactId, userId);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(204).json({
    status: 204,
    message: 'Successfully deleted contact!',
  });
};

export const updateContactsController = async (req, res, next) => {
  const { contactId } = req.params;
  const updatedPayload = req.body;
  const { _id: userId } = req.user; // Отримання userId із запиту

  // Оновлення контакту користувача за ID
  const contact = await updateContact(contactId, updatedPayload, userId);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully updated contact!',
    data: contact,
  });
};
