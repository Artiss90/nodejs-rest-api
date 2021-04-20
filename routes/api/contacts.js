const express = require("express");
const router = express.Router();
const contactsModel = require("../../model/contacts.js");

/* 
TODO  @ GET /api/contacts
*ничего не получает
*вызывает функцию listContacts для работы с json-файлом contacts.json
*возвращает массив всех контактов в json-формате со статусом 200 
*/
router.get("/", async (req, res, next) => {
  try {
    const contacts = await contactsModel.listContacts();
    return res.json({
      status: "success",
      code: 200,
      data: { contacts },
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const contact = await contactsModel.getContactById(req.params.contactId);
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
});

/*
TODO @ POST /api/contacts
*Получает body в формате {name, email, phone}
*Если в body нет каких-то обязательных полей, возвращает json с ключом {"message": "missing required name field"} и статусом 400
*Если с body все хорошо, добавляет уникальный идентификатор в объект контакта
*Вызывает функцию addContact(body) для сохранения контакта в файле contacts.json
*По результату работы функции возвращает объект с добавленным id {id, name, email, phone} и статусом 201
*/
router.post("/", async (req, res, next) => {
  try {
    const contacts = await contactsModel.addContact(req.body);
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
});

router.delete("/:contactId", async (req, res, next) => {
  res.json({ message: "template message" });
});

router.patch("/:contactId", async (req, res, next) => {
  res.json({ message: "template message" });
});

module.exports = router;
