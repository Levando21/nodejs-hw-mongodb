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
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { CLOUDINARY } from '../constans/index.js';
import { env } from '../utils/env.js';

import dotenv from 'dotenv';
dotenv.config();
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
  const photo = req.file;

  let photoUrl;

  if (photo) {
    if (env(CLOUDINARY.ENABLE_CLOUDINARY) === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }

  console.log('ENABLE_CLOUDINARY:', env(CLOUDINARY.ENABLE_CLOUDINARY));
  const createdContact = await createContacts({
    name: req.body.name,
    phoneNumber: req.body.phoneNumber,
    email: req.body.email,
    isFavourite: req.body.isFavourite,
    contactType: req.body.contactType,
    userId: req.user._id,
    photo: photoUrl,
  });

  console.log(photoUrl);

  res.status(201).json({
    status: 201,
    message: `Successfully created contact for ${req.user.name}!`,
    data: createdContact,
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
  const userId = req.user._id;
  const photo = req.file;

  let photoUrl;

  if (photo) {
    if (env(CLOUDINARY.ENABLE_CLOUDINARY) === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }

  const result = await updateContact(contactId, userId, {
    ...req.body,
    photo: photoUrl,
  });

  if (result === null) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: `Successfully updated the contact for ${req.user.name}!`,
    data: result,
  });
};
