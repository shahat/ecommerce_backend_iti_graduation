const express = require("express");
var router = express.Router();

var {
  getPastOrderOfOneUser,getComingOrderOfOneUser,
  getOneOrderById,
  createOrder,
  updatingOrders,
  cancelOrder,
  getAllOrders
} = require("../controller/orders");

router.get("/past/:id", getPastOrderOfOneUser);
router.get("/coming/:id", getComingOrderOfOneUser);
router.get("/", getAllOrders);

router.post("/", createOrder);
router.patch("/:id", updatingOrders);
router.get("/:id", getOneOrderById);
router.delete("/:id", cancelOrder);

module.exports = router;
