// ? для работы с db можно использовать функции lodash
const db = require("./db");

const { ObjectId } = require("mongodb");

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
  const collection = await getCollection(db, nameCollectionContacts);
  const objectId = new ObjectId(contactId);

  // ? здесь,через консоль показывается время создания документа на сервере (у сервера может отличатся местное время)
  // console.log(objectId.getTimestamp());

  const [result] = await collection.find({ _id: objectId }).toArray();

  return result;
};

const removeContact = async (contactId) => {
  const collection = await getCollection(db, nameCollectionContacts);
  const objectId = new ObjectId(contactId);

  const { value: result } = await collection.findOneAndDelete({
    _id: objectId,
  });

  return result;
};

const addContact = async (body) => {
  const record = {
    ...body,
  };
  const collection = await getCollection(db, nameCollectionContacts);

  const {
    ops: [result],
  } = await collection.insertOne(record);

  return result;
};

const updateContact = async (contactId, body) => {
  const collection = await getCollection(db, nameCollectionContacts);
  const objectId = new ObjectId(contactId);

  const { value: result } = await collection.findOneAndUpdate(
    {
      _id: objectId,
    },
    { $set: body },
    { returnOriginal: false }
  );

  return result;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
