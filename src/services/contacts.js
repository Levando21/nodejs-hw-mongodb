import { ContactsCollection } from '../db/models/contacts.js';

export const createContacts = async (payload) => {
  const contacts = await ContactsCollection.create(payload);
  return contacts;
};

export const getContacts = async () => {
  const contacts = await ContactsCollection.find();
  return contacts;
};

export const getContactById = async (contactId) => {
  const contact = await ContactsCollection.findById(contactId);
  return contact;
};

export const deleteContact = async (contactId) => {
  const contact = await ContactsCollection.findOneAndDelete({ _id: contactId });
  return contact;
};

export const updateContact = async (contactId, payload, output = {}) => {
  const contact = await ContactsCollection.findOneAndUpdate(
    { _id: contactId },
    payload,
    { new: true },
  );
  return contact;
};
