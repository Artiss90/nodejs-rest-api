// const fs = require("fs/promises");
// const contacts = require("./contacts.json");
// ? для работы с db можно использовать функции lodash
const db = require("./db");
const { v4: uuidv4 } = require("uuid");
const { ObjectId } = require("mongodb");

const pathContacts = "contacts";
const nameCollectionContacts = "contacts";

const getCollection = async (db, name) => {
  const client = await db;
  const collection = await client.db().collection(name);
  return collection;
};

const listContacts = async () => {
  const collection = await getCollection(db, nameCollectionContacts);
  const result = await collection.find().toArray();
  return result;
};

const getContactById = async (contactId) => {
  return db.get(pathContacts).find({ id: contactId }).value();
};

const removeContact = async (contactId) => {
  const [record] = db.get(pathContacts).remove({ id: contactId }).write();
  return record;
};

const addContact = async (body) => {
  // const id = uuidv4();
  const record = {
    // id,
    ...body,
  };
  // db.get(pathContacts).push(record).write();
  const collection = await getCollection(db, nameCollectionContacts);
  const {
    ops: [result],
  } = await collection.insertOne(record);

  return result;
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
