const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/me", authMiddleware, authController.me);
router.post("/forget_password", authController.forgetPassword);
router.post("/reset-password", authController.resetPassword);
router.post("/logout", authMiddleware, authController.logout);

module.exports = router;
