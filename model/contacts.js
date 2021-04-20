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

const removeContact = async (contactId) => {
  const [record] = db.get(pathContacts).remove({ id: contactId }).write();
  console.log("🚀 ~ file: contacts.js ~ line 19 ~ removeContact ~ [record]", [
    record,
  ]);
  return record;
};

const addContact = async (body) => {
  const id = uuidv4();
  const record = {
    id,
    ...body,
  };
  db.get(pathContacts).push(record).write();
  return record;
};

const updateContact = async (contactId, body) => {
  const record = await db
    .get(pathContacts)
    .find({ id: contactId })
    .assign(body)
    .value();
  db.write();
  return record.id ? record : null;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
