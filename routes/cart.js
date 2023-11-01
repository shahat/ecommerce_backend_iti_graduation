const express = require("express");
const {
  getAllCartProducts,
  addOneProductToCart,
  modifyOneProductFromCart,
  deleteOneProductFromCart,
  addUserCart,
} = require("../controller/cart");

const router = express.Router();
// user and guest user 
router.get("/", getAllCartProducts);
// user and guest user 
router.post("/", addUserCart);
// user and guest user 
router.post("/product",addOneProductToCart);
// user and guest user 
router.patch("/", modifyOneProductFromCart);
// user and guest user 
router.delete("/", deleteOneProductFromCart);
module.exports = router;
