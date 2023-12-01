const express = require("express");
var router = express.Router();

var {
  getPastOrderOfOneUser,getComingOrderOfOneUser,
  getOneOrderById,
  createOrder,
  updatingOrders,
  deleteOrder,
} = require("../controller/orders");
const { tokenValidate } = require("../middlewares/isTokenValid");


router.get("/past/:id", getPastOrderOfOneUser);
router.get("/coming/:id", getComingOrderOfOneUser);

router.post("/", createOrder);
router.patch("/:id", tokenValidate, updatingOrders);
router.get("/:id", getOneOrderById);
router.delete("/:id", deleteOrder);

module.exports = router;
