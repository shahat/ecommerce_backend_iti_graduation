const express = require("express");
const {
  getAllCartProducts,
  addOneProductToCart,
  modifyOneProductFromCart,
  deleteOneProductFromCart,
  addUserCart,
} = require("../controller/cart");

const router = express.Router();

router.get("/", getAllCartProducts);

router.post("/", addUserCart);

router.post("/product", addOneProductToCart);

router.patch("/", modifyOneProductFromCart);

router.delete("/", deleteOneProductFromCart);

module.exports = router;
