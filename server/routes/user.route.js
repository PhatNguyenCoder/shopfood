const express = require("express");
const userController = require("../controllers/user.controller");
const router = express.Router();

router.get("/users", userController.getUsers);

// // đăng ký tài khoản
router.post("/users", userController.postUser);

// // đăng nhập với user

//login user
router.post("/login-user", userController.loginUser);

// login admin
router.post("/login", userController.loginToken);

module.exports = router;
