const Contacts = require("./schemas/contactSchema");

const listContacts = async (userId, query) => {
  const {
    sortBy,
    sortByDesc,
    filter,
    favorite = null,
    limit = 20,
    offset = 0,
  } = query;

  const optionsSearch = { owner: userId };

  if (favorite !== null) {
    optionsSearch.favorite = favorite;
  }
  const result = await Contacts.paginate(optionsSearch, {
    limit,
    offset,
    sort: {
      ...(sortBy ? { [`${sortBy}`]: 1 } : {}), // .../contacts?sortBy=name  => name: 1
      ...(sortByDesc ? { [`${sortByDesc}`]: -1 } : {}),
    },
    select: filter ? filter.split("|").join(" ") : "",
    populate: {
      path: "owner",
      select: "email subscription",
    },
  });
  // const { docs: contacts, totalDocs: total } = result;
  // return { contacts, total, limit, offset };
  return result;
};

const getContactById = async (userId, contactId) => {
  const result = await Contacts.findById(contactId, { owner: userId });

  return result;
};

const removeContact = async (userId, contactId) => {
  const result = await Contacts.findByIdAndRemove(contactId, { owner: userId });

  return result;
};

const addContact = async (userId, body) => {
  const result = await Contacts.create({ ...body, owner: userId });

  return result;
};

const updateContact = async (userId, contactId, body) => {
  const result = await Contacts.findByIdAndUpdate(
    { _id: contactId, owner: userId },
    { ...body },
    { new: true }
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
