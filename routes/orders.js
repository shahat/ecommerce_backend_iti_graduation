const express = require("express");
const { protect } = require("../controller/authController");
var router = express.Router();
var {
  getPastOrderOfOneUser,
  getComingOrderOfOneUser,
  getOneOrderById,
  createOrder,
  updatingOrders,
  deleteOrder,
  completedOrderProducts,
} = require("../controller/orders");

router.get("/past/:id", getPastOrderOfOneUser);
router.get("/coming/:id", getComingOrderOfOneUser);
router.get("/completedOrderProducts", completedOrderProducts);
router.post("/", createOrder);
router.patch("/:id", updatingOrders);
router.get("/:id", getOneOrderById);
router.delete("/:id", deleteOrder);

module.exports = router;
