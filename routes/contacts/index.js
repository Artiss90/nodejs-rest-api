const express = require("express");
const router = express.Router();
const ctrl = require("../../controllers/contacts");
const validationRoute = require("./valid-contact-route.js");
const guard = require("../../helper/guard");

/* 
TODO  @ GET /api/contacts
*ничего не получает
*вызывает функцию listContacts для работы с json-файлом contacts.json
*возвращает массив всех контактов в json-формате со статусом 200 
*/
router.get("/", guard, validationRoute.validationQueryContact, ctrl.getAll);

/*
TODO @ GET /api/contacts/:contactId
*Не получает body
*Получает параметр contactId
*вызывает функцию getById для работы с json-файлом contacts.json
*если такой id есть, возвращает объект контакта в json-формате со статусом 200
*если такого id нет, возвращает json с ключом "message": "Not found" и статусом 404
*/
router.get(
  "/:contactId",
  guard,
  validationRoute.validationObjectId,
  ctrl.getById
);

/*
TODO @ POST /api/contacts
*Получает body в формате {name, email, phone}
*Если в body нет каких-то обязательных полей, возвращает json с ключом {"message": "missing required name field"} и статусом 400
*Если с body все хорошо, добавляет уникальный идентификатор в объект контакта
*Вызывает функцию addContact(body) для сохранения контакта в файле contacts.json
*По результату работы функции возвращает объект с добавленным id {id, name, email, phone} и статусом 201
*/
router.post("/", guard, validationRoute.validationCreateContact, ctrl.create);

/*
TODO @ DELETE /api/contacts/:contactId
*Не получает body
*Получает параметр contactId
*вызывает функцию removeContact для работы с json-файлом contacts.json
*если такой id есть, возвращает json формата {"message": "contact deleted"} и статусом 200
*если такого id нет, возвращает json с ключом "message": "No content" и статусом 204
*/
router.delete(
  "/:contactId",
  guard,
  validationRoute.validationObjectId,
  ctrl.remove
);

/*
TODO @ PATCH /api/contacts/:contactId/favorite
*Получает параметр contactId
*Получает body в json-формате c обновлением  поля favorite
*Вызывает функцию updateContact(contactId, body) для обновления контакта в файле contacts.json
*Если такого id нет, возвращает json с ключом "message": "Not found" и статусом 404
*По результату работы функции возвращает обновленный объект контакта и статусом 200. В противном случае, возвращает json с ключом "message": "Not found" и статусом 404
*/
router.patch(
  "/:contactId/favorite",
  guard,
  validationRoute.validationChangeFavorite,
  ctrl.updateStatus
);

/*
TODO @ PUT /api/contacts/:contactId
*Получает параметр contactId
*Получает body в json-формате c обновлением любых полей name, email и phone
*Если body нет, возвращает json с ключом {"message": "missing fields"} и статусом 400
*Если с body все хорошо, вызывает функцию updateContact(contactId, body) (напиши ее) для обновления контакта в файле contacts.json
*По результату работы функции возвращает обновленный объект контакта и статусом 200. В противном случае, возвращает json с ключом "message": "Not found" и статусом 404
*/
router.put(
  "/:contactId",
  guard,
  validationRoute.validationUpdateContact,
  ctrl.update
);

module.exports = router;
