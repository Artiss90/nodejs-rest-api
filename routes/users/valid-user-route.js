const Joi = require("joi");
const { Subscription } = require("../../helper/constants");

const schemaUpdateSubscription = Joi.object({
  subscription: Joi.string()
    .valid(...Object.values(Subscription))
    .required(),
});

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
  validationChangeSubscription: async (req, res, next) => {
    return await validate(schemaUpdateSubscription, req.body, next);
  },
};
