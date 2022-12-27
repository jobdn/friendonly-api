const express = require("express");
const { body } = require("express-validator");

const { authController } = require("../controllers");

const router = express.Router();

router.post(
  "/registration",
  body("email").isEmail(),
  body(
    "password",
    "Password must have length more then 5 and less then 32 character."
  )
    .trim()
    .isLength({ min: 5, max: 32 }),
  body(
    "name",
    "Name of user must have length more then 5 and less then 32 character."
  )
    .trim()
    .isLength({ min: 5, max: 32 }),
  authController.registration
);
router.get("/activate/:link", authController.activate);
router.post(
  "/login",
  body("email").isEmail(),
  body(
    "password",
    "Password must have length more then 5 and less then 32 character."
  )
    .trim()
    .isLength({ min: 5, max: 32 }),
  authController.login
);
router.get("/refresh", authController.refresh);
router.post("/logout", authController.logout);

module.exports = router;
