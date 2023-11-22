const express = require("express");
const authenticateUser = require("../Middleware/auth");
const payRoute = express.Router();
const paymentController = require("../Controllers/paymentController");

payRoute.get('/checkPremium', authenticateUser, paymentController.checkPremium);
payRoute.get("/premiummember", authenticateUser, paymentController.purchasePremium);
payRoute.post("/updateTransacation", authenticateUser, paymentController.updateTransaction);

module.exports = payRoute;
