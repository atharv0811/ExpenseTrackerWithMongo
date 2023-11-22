const bodyParser = require("body-parser");
const express = require("express");
require("dotenv").config();
const router = require("./Routers/routes");
const userRouter = require("./Routers/userRoute");
const path = require("path");
const expenseRouter = require("./Routers/expenseRouter");
const payRoute = require("./Routers/paymentRoute");
const mongoose = require("mongoose");
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "..", "Frontend", "public")));

app.use(router);
app.use("/user", userRouter);
app.use("/expense", expenseRouter);
app.use("/payment", payRoute);

mongoose
  .connect(process.env.MONGOURL)
  .then(() => {
    console.log("Connected");
    app.listen(port);
  })
  .catch((err) => {
    console.log(err);
  });
