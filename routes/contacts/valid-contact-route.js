const Joi = require("joi");
const mongoose = require("mongoose");

const schemaCreateContact = Joi.object({
  name: Joi.string().alphanum().min(3).max(30).required(),
  phone: Joi.string().min(3).max(20).required(),
  favorite: Joi.boolean().optional(),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
});

const schemaUpdateContact = Joi.object({
  name: Joi.string().alphanum().min(3).max(30).optional(),
  phone: Joi.string().min(3).max(20).optional(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .optional(),
  favorite: Joi.boolean().optional(),
}).or("name", "phone", "email");

const schemaUpdateFavorite = Joi.object({
  favorite: Joi.boolean().required(),
});

const schemaQueryContact = Joi.object({
  sortBy: Joi.string().valid("name", "phone", "email", "id").optional(),
  sortByDesc: Joi.string().valid("name", "phone", "email", "id").optional(),
  filter: Joi.string().optional(),
  limit: Joi.number().integer().min(1).max(50).optional(),
  offset: Joi.number().integer().min(0).optional(),
  favorite: Joi.boolean().optional(),
}).without("sortBy", "sortByDesc");

const validate = async (schema, obj, next) => {
  try {
    await schema.validateAsync(obj);
    return next();
  } catch (err) {
    console.log(err);
    next({ status: 400, message: err.message.replace(/"/g, "'") });
  }
};

module.exports = {
  validationCreateContact: async (req, res, next) => {
    return await validate(schemaCreateContact, req.body, next);
  },
  validationUpdateContact: async (req, res, next) => {
    return await validate(schemaUpdateContact, req.body, next);
  },
  validationChangeFavorite: async (req, res, next) => {
    return await validate(schemaUpdateFavorite, req.body, next);
  },
  validationQueryContact: async (req, res, next) => {
    return await validate(schemaQueryContact, req.query, next);
  },
  validationObjectId: async (req, res, next) => {
    let par = req.params;
    console.log(
      "🚀 ~ file: valid-contact-route.js ~ line 64 ~ validationObjectId: ~ par",
      par
    );
    if (!mongoose.Types.ObjectId.isValid(req.params.contactId)) {
      return next({ status: 400, message: "Invalid Object Id" });
    }
    next();
  },
};
