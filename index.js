// step-1 =>  require nongoose , express , and also define the routes
const express = require("express");
const mongoose = require("mongoose");

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

// schedule Function to delete old guest carts
const deleteOldCarts = require("./helpers/schedule");
deleteOldCarts();

app.use(cors());
app.use(express.json());

app.use("/users", authRouter);
app.use("/product", productRouter);
app.use("/orders", ordersRouter);
app.use("/reviews", reviewsRouter);
app.use("/cart", cartRouter);
app.use("/wish", wishRouter);
app.use("/categories", categoryRoute);
app.use("/subcategories", subCategoryRoute);

// handle not found not found middleware
app.use("*", function (req, res, next) {
  res.status(404).json({ message: "notfound" });
});

//  handling middleware error
app.use((err, req, res, next) => {
  res.status(500).json({ message: "something went wrong" });
});

mongoose
  .connect(
    "mongodb+srv://normaluser:normaluser123@market.mo3v4yc.mongodb.net/market?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("success connect to database");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(4000, () => {
  console.log("listining to port 4000");
});
