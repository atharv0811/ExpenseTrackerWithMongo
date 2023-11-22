const express = require("express");
const userRouter = express.Router();
const userController = require("../Controllers/userController");

userRouter.get("/register", userController.getRegistrationPage);
userRouter.get("/login", userController.getLoginPage);
userRouter.post("/addUser", userController.addUser);
userRouter.post("/check-login", userController.checkLogin);
userRouter.get("/home", userController.getHome);
// userRouter.post("/forgetPassword", userController.SendforgetPasswordLink);
// userRouter.get("/forgetPassword/:id", userController.getForgetPasswordPage);
// userRouter.post("/updatePasswordData", userController.updatePasswordData);

module.exports = userRouter;
