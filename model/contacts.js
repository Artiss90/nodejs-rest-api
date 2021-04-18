// const fs = require("fs/promises");
// const contacts = require("./contacts.json");
// ? для работы с db можно использовать функции lodash
const db = require("./db");
const { v4: uuidv4 } = require("uuid");

const listContacts = async () => {
  return db.get("contacts").value();
};

const getContactById = async (contactId) => {};

const removeContact = async (contactId) => {};

const addContact = async (body) => {
  const id = uuidv4();
  const record = {
    id,
    ...body,
  };
  db.get("contacts").push(record).write();
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
