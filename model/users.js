const User = require("./schemas/userSchema");

const findById = async (id) => {
  return await User.findById(id);
};

const findByEmail = async (email) => {
  return await User.findOne({ email });
};

const findByVerifyTokenEmail = async (token) => {
  return await User.findOne({ verifyTokenEmail: token });
};

const create = async (userOptions) => {
  const user = new User(userOptions);
  return await user.save();
};

const updateToken = async (id, token) => {
  return await User.findByIdAndUpdate(id, { token });
};
const updateVerifyToken = async (id, verify, verifyToken) => {
  return await User.findByIdAndUpdate(id, {
    verify,
    verifyTokenEmail: verifyToken,
  });
};

const updateSubscribe = async (id, subscription) => {
  return await User.findByIdAndUpdate(id, { subscription });
};
const updateAvatar = async (id, avatar, idCloudAvatar = null) => {
  return await User.findByIdAndUpdate(id, {
    avatarURL: avatar,
    idCloudAvatar: idCloudAvatar,
  });
};

module.exports = {
  findById,
  findByEmail,
  findByVerifyTokenEmail,
  create,
  updateToken,
  updateVerifyToken,
  updateSubscribe,
  updateAvatar,
};
