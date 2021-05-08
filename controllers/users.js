const jimp = require("jimp");
const fs = require("fs/promises");
const path = require("path");
const Users = require("../model/users");
const { HttpCode } = require("../helper/constants");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const reg = async (req, res, next) => {
  const { email } = req.body;
  const user = await Users.findByEmail(email);
  if (user) {
    return res.status(HttpCode.CONFLICT).json({
      status: "error",
      code: HttpCode.CONFLICT,
      message: "Email is already use",
    });
  }
  try {
    const newUser = await Users.create(req.body);
    return res.status(HttpCode.CREATED).json({
      status: "success",
      code: HttpCode.CREATED,
      data: {
        id: newUser.id,
        email: newUser.email,
        subscription: newUser.subscription,
        avatar: newUser.avatarURL,
      },
    });
  } catch (e) {
    next(e);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await Users.findByEmail(email);
  const isValidPassword = await user?.validPassword(password);
  if (!user || !isValidPassword) {
    return res.status(HttpCode.UNAUTHORIZED).json({
      status: "error",
      code: HttpCode.UNAUTHORIZED,
      message: "Invalid credentials",
    });
  }
  const payload = { id: user.id };
  const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: "2h" });
  await Users.updateToken(user.id, token);
  return res.status(HttpCode.OK).json({
    status: "success",
    code: HttpCode.OK,
    data: { token },
  });
};

const logout = async (req, res, next) => {
  const id = req.user?.id;
  await Users.updateToken(id, null);
  return res.status(HttpCode.NO_CONTENT).json({});
};

const updateSubscription = async (req, res, next) => {
  const id = req.user?.id;
  const subscription = req.body.subscription;

  await Users.updateSubscribe(id, subscription);
  const updateUser = await Users.findById(id);

  return res.status(HttpCode.OK).json({
    status: "success",
    code: HttpCode.OK,
    data: { email: updateUser.email, subscription: updateUser.subscription },
  });
};

const current = async (req, res, next) => {
  const id = req.user?.id;
  const { email, subscription, avatarURL } = await Users.findById(id);
  return res.status(HttpCode.OK).json({
    status: "success",
    code: HttpCode.OK,
    data: {
      email: email,
      subscription: subscription,
      avatar: avatarURL,
    },
  });
};

const onlyPro = async (req, res, next) => {
  return res.json({
    status: "success",
    code: 200,
    data: {
      message: "Only Pro",
    },
  });
};
const onlyBusiness = async (req, res, next) => {
  return res.json({
    status: "success",
    code: 200,
    data: {
      message: "Only Business",
    },
  });
};

const updateAvatar = async (req, res, next) => {
  const { id } = req.user;
  const avatarUrl = await saveAvatarUser(req);
  await Users.updateAvatar(id, avatarUrl);
  // const { idCloudAvatar, avatarUrl } = await saveAvatarUserToCloud(req);
  // await Users.updateAvatar(id, avatarUrl, idCloudAvatar);
  return res
    .status(HttpCode.OK)
    .json({ status: "success", code: HttpCode.OK, data: { avatarUrl } });
};

const saveAvatarUser = async (req) => {
  const FOLDER_AVATARS = process.env.FOLDER_AVATARS;
  const pathFile = req.file.path;
  const newNameAvatar = `${Date.now().toString()}-${req.file.originalname}`;
  const img = await jimp.read(pathFile);
  await img
    .autocrop()
    .cover(250, 250, jimp.HORIZONTAL_ALIGN_CENTER | jimp.VERTICAL_ALIGN_MIDDLE)
    .writeAsync(pathFile);
  try {
    await fs.rename(
      pathFile,
      path.join(process.cwd(), "public", FOLDER_AVATARS, newNameAvatar)
    );
  } catch (e) {
    console.log(e.message);
  }
  console.log(
    "🚀 ~ file: users.js ~ line 140 ~ saveAvatarUser ~ pathFile",
    pathFile
  );
  // ? удаляем старый аватар с временного хранилища
  // const oldAvatar = req.user.avatarURL;
  // if (oldAvatar.includes(`${FOLDER_AVATARS}/`)) {
  //   await fs.unlink(path.join(process.cwd(), "public", oldAvatar));
  // }
  return path.join(FOLDER_AVATARS, newNameAvatar).replace("\\", "/"); // регулярка для  замены слэша
};

module.exports = {
  reg,
  login,
  logout,
  updateSubscription,
  current,
  onlyPro,
  onlyBusiness,
  updateAvatar,
};
