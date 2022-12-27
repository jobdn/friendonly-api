const express = require("express");

const authMiddleware = require("../middlewares/auth.middleware");

const { userController } = require("../controllers");

const router = express.Router();

router.get("/", authMiddleware, userController.getUsers);

module.exports = router;
