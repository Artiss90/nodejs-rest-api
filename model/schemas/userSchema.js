const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const gravatar = require("gravatar");
const { Subscription } = require("../../helper/constants");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

const SALT_FACTOR = 6;

const schemaUser = new Schema(
  {
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      validate(value) {
        const re = /\S+@\S+\.\S+/;
        return re.test(String(value).toLowerCase());
      },
    },
    subscription: {
      type: String,
      enum: {
        values: Object.values(Subscription),
        message: "It's not allowed",
      },
      default: Subscription.STARTER,
    },
    token: {
      type: String,
      default: null,
    },
    avatarURL: {
      type: String,
      default: function () {
        return gravatar.url(this.email, { s: "250" }, true);
      },
    },
    idCloudAvatar: {
      type: String,
      default: null,
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verifyTokenEmail: {
      type: String,
      required: true,
      default: uuidv4(),
    },
  },
  { timestamps: true }
);

// ? Если поле password изменяется тогда солим (salt)
schemaUser.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(SALT_FACTOR);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

schemaUser.methods.validPassword = async function (password) {
  return await bcrypt.compare(String(password), this.password);
};
const UserSchema = model("user", schemaUser);

module.exports = UserSchema;
