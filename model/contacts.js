// const fs = require("fs/promises");
// const contacts = require("./contacts.json");
// ? для работы с db можно использовать функции lodash
const db = require("./db");
const { v4: uuidv4 } = require("uuid");

const pathContacts = "contacts";

const listContacts = async () => {
  return db.get(pathContacts).value();
};

const getContactById = async (contactId) => {
  return db.get(pathContacts).find({ id: contactId }).value();
};

const removeContact = async (contactId) => {};

const addContact = async (body) => {
  const id = uuidv4();
  const record = {
    id,
    ...body,
  };
  db.get(pathContacts).push(record).write();
  return record;
};

const updateContact = async (contactId, body) => {};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
