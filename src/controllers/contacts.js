import {
  createContacts,
  getContacts,
  getContactById,
  deleteContact,
  updateContact,
} from '../services/contacts.js';
import createHttpError from 'http-errors';

export const getContactsController = async (req, res, next) => {
  const contacts = await getContacts();

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
  const contact = await getContactById(contactId);

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
  const contact = await createContacts(req.body);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(201).json({
    status: 201,
    message: 'Successfully created contact!',
    data: contact,
  });
};

export const deleteContactsController = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await deleteContact(contactId);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully deleted contact!',
    data: contact,
  });
};

export const updateContactsController = async (req, res, next) => {
  const { contactId } = req.params;
  const updatedPayload = req.body;
  const contact = await updateContact(contactId, updatedPayload);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully updated contact!',
    data: contact,
  });
};
