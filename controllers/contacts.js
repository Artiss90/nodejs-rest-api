const Contacts = require("../model/contacts");
/* 
TODO  @ GET /api/contacts
*ничего не получает
*вызывает функцию listContacts для работы с json-файлом contacts.json
*возвращает массив всех контактов в json-формате со статусом 200 
*/
const getAll = async (req, res, next) => {
  try {
    const contacts = await Contacts.listContacts();
    return res.json({
      status: "success",
      code: 200,
      data: { contacts },
    });
  } catch (error) {
    next(error);
  }
};

/*
TODO @ GET /api/contacts/:contactId
*Не получает body
*Получает параметр contactId
*вызывает функцию getById для работы с json-файлом contacts.json
*если такой id есть, возвращает объект контакта в json-формате со статусом 200
*если такого id нет, возвращает json с ключом "message": "Not found" и статусом 404
*/
const getById = async (req, res, next) => {
  try {
    const contact = await Contacts.getContactById(req.params.contactId);
    if (contact) {
      return res.json({
        status: "success",
        code: 200,
        data: {
          contact,
        },
      });
    } else {
      return res.status(404).json({
        status: "error",
        code: 404,
        data: "Not found",
      });
    }
  } catch (error) {
    next(error);
  }
};

/*
TODO @ POST /api/contacts
*Получает body в формате {name, email, phone}
*Если в body нет каких-то обязательных полей, возвращает json с ключом {"message": "missing required name field"} и статусом 400
*Если с body все хорошо, добавляет уникальный идентификатор в объект контакта
*Вызывает функцию addContact(body) для сохранения контакта в файле contacts.json
*По результату работы функции возвращает объект с добавленным id {id, name, email, phone} и статусом 201
*/
const create = async (req, res, next) => {
    try {
      const contacts = await Contacts.addContact(req.body);
      return res.status(201).json({
        status: "success",
        code: 201,
        data: {
          contacts,
        },
      });
    } catch (error) {
      next(error);
    }
  }
;

/*
TODO @ DELETE /api/contacts/:contactId
*Не получает body
*Получает параметр contactId
*вызывает функцию removeContact для работы с json-файлом contacts.json
*если такой id есть, возвращает json формата {"message": "contact deleted"} и статусом 200
*если такого id нет, возвращает json с ключом "message": "No content" и статусом 204
*/
const remove = async (req, res, next) => {
  try {
    const contact = await Contacts.removeContact(req.params.contactId);
    if (contact) {
      return res.json({
        status: "success",
        code: 200,
        data: {
          contact,
        },
      });
    } else {
      return res.status(404).json({
        status: "error",
        code: 404,
        data: "No content",
      });
    }
  } catch (error) {
    next(error);
  }
};

/*
TODO @ PATCH /api/contacts/:contactId/favorite
*Получает параметр contactId
*Получает body в json-формате c обновлением  поля favorite
*Вызывает функцию updateContact(contactId, body) для обновления контакта в файле contacts.json
*Если такого id нет, возвращает json с ключом "message": "Not found" и статусом 404
*По результату работы функции возвращает обновленный объект контакта и статусом 200. В противном случае, возвращает json с ключом "message": "Not found" и статусом 404
*/
const updateStatus = async (req, res, next) => {
    try {
      const contact = await Contacts.updateContact(
        req.params.contactId,
        req.body
      );
      if (contact) {
        return res.json({
          status: "success",
          code: 200,
          data: {
            contact,
          },
        });
      } else {
        return res.status(404).json({
          status: "error",
          code: 404,
          data: "Not found",
        });
      }
    } catch (error) {
      next(error);
    }
  }
;

/*
TODO @ PUT /api/contacts/:contactId
*Получает параметр contactId
*Получает body в json-формате c обновлением любых полей name, email и phone
*Если body нет, возвращает json с ключом {"message": "missing fields"} и статусом 400
*Если с body все хорошо, вызывает функцию updateContact(contactId, body) (напиши ее) для обновления контакта в файле contacts.json
*По результату работы функции возвращает обновленный объект контакта и статусом 200. В противном случае, возвращает json с ключом "message": "Not found" и статусом 404
*/
const update = async (req, res, next) => {
    try {
      const contact = await Contacts.updateContact(
        req.params.contactId,
        req.body
      );
      if (contact) {
        return res.json({
          status: "success",
          code: 200,
          data: {
            contact,
          },
        });
      } else {
        return res.status(404).json({
          status: "error",
          code: 404,
          data: "Not found",
        });
      }
    } catch (error) {
      next(error);
    }
  }
;

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
  updateStatus,
};
