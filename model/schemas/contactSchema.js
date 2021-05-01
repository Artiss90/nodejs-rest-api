const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const schemaContact = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
      min: 3,
      max: 20,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    // owner: {
    //   // type: SchemaTypes.ObjectId,
    //   ref: "user",
    // },
  },
  {
    timestamps: true,
    toObject: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret._id;
        return ret;
      },
    },
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret._id;
        delete ret.name;
        return ret;
      },
    },
  }
);

// ? валидация поля 'name'
schemaContact.path("name").validate((value) => {
  const re = /[A-z]\w+/;
  return re.test(String(value));
});

// ? заменяем поле 'name' на виртуальное поле 'nick'
schemaContact.virtual("nick").get(function () {
  return `${this.name}`;
});

const ContactSchema = model("contact", schemaContact);

module.exports = ContactSchema;
