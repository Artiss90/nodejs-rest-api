const express = require("express");
const router = express.Router();
const ctrl = require("../../controllers/users");
const guard = require("../../helper/guard");
const validationRouteUser = require("./valid-user-route");
const subscription = require("../../helper/subscription");
const { Subscription } = require("../../helper/constants");

// TODO изменить подписку
router.patch(
  "/",
  guard,
  validationRouteUser.validationChangeSubscription,
  ctrl.updateSubscription
);

router.post("/register", ctrl.reg);
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

module.exports = router;
