// step-1 =>  require nongoose , express , and also define the routes
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const app = express();
const authRouter = require("./routes/authRouter");
const productRouter = require("./routes/product");
const ordersRouter = require("./routes/orders");
const reviewsRouter = require("./routes/reviews");
const cartRouter = require("./routes/cart");
const wishRouter = require("./routes/wishlist");
const categoryRoute = require("./routes/categoryRoute");
const subCategoryRoute = require("./routes/subCategoryRoute");

const adminRouter = require("./routes/admin");

const coupon = require("./routes/coupon");

// schedule Function to delete old guest carts
const deleteOldCarts = require("./helpers/schedule");
const connectDB = require("./config/db");
const errorHandler = require("./middlewares/error");
// const nodemailer = require("nodemailer");
// const usersModel = require("./models/user");
const emailRecoveryRoute = require("./routes/emailRecovery");
const resetCodeRoute = require("./routes/resetCode");
const resetPasswordRoute = require("./routes/resetPassword");

// Connect to DB
connectDB();

// Express App

const port = process.env.PORT || 5000;

// middlewares
app.use(cors());
app.use(express.json());
deleteOldCarts();

// Routes

app.use("/users", authRouter);
app.use("/admin", adminRouter);
app.use("/product", productRouter);
app.use("/orders", ordersRouter);
app.use("/reviews", reviewsRouter);
app.use("/cart", cartRouter);
app.use("/wish", wishRouter);
app.use("/categories", categoryRoute);
app.use("/subcategories", subCategoryRoute);
app.use("/coupon", coupon);
app.use("/emailRecovery", emailRecoveryRoute);
app.use("/resetCode", resetCodeRoute);
app.use("/resetPassword", resetPasswordRoute);

// handle not found not found middleware
app.use("*", function (req, res, next) {
  res.status(404).json({ message: "notfound" });
});

app.use("/", (req, res) => {
  return res.json({
    message: "Welcome to the Node.js REST API using ExpressJS and MongoDB",
  });
});

app.use(errorHandler);

const server = app.listen(port, () =>
  console.log(`Server started listening on ${port}`)
);
