const express = require("express");
const router = express.Router();
const ctrl = require("../../controllers/users");
const guard = require("../../helper/guard");
const validationRouteUser = require("./valid-user-route");
const subscription = require("../../helper/subscription");
const { Subscription } = require("../../helper/constants");
const rateLimit = require("express-rate-limit");
const uploadAvatar = require("../../helper/upload-avatar");

const limiterRegister = rateLimit({
  windowMs: 60 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  handler: (req, res, next) => {
    return res.status(429).json({
      status: "error",
      code: 429,
      message: "Too Many Requests Register",
    });
  },
});

// TODO изменить подписку
router.patch(
  "/",
  guard,
  validationRouteUser.validationChangeSubscription,
  ctrl.updateSubscription
);

// TODO регистрация, авторизация, выход с учетной записи
router.post("/register", limiterRegister, ctrl.reg);
router.post("/login", ctrl.login);
router.post("/logout", guard, ctrl.logout);

// TODO показать текущего пользователя
router.get("/current", guard, ctrl.current);

// ? Рауты для премиум-подписок
router.get("/pro", guard, subscription(Subscription.PRO), ctrl.onlyPro);
router.get(
  "/business",
  guard,
  subscription(Subscription.BUSINESS),
  ctrl.onlyBusiness
);

// TODO раут для смены  аватарки
router.patch(
  "/avatars",
  guard,
  uploadAvatar.single("avatar"), // принимает поле "avatar"
  ctrl.updateAvatar
);

module.exports = router;
