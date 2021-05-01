const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const { Subscription } = require("../../helper/constants");
const bcrypt = require("bcryptjs");
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
  console.log("🚀 ~ file: userSchema.js ~ line 48 ~ password", password);
  return await bcrypt.compare(String(password), this.password);
};
const UserSchema = model("user", schemaUser);

module.exports = UserSchema;
