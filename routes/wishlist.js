const express = require("express");
const {
  getAllWishlistProducts,
  addUserWishlist,
  addOneProductToWishlist,
  deleteOneProductFromWishlist,
} = require("../controller/wishlist");

const router = express.Router();
router.get("/", getAllWishlistProducts);
router.post("/", addUserWishlist);
router.patch("/", addOneProductToWishlist);
router.delete("/", deleteOneProductFromWishlist);

module.exports = router;
