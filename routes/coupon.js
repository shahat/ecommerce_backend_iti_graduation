const express = require("express");
var router = express.Router();

var {
    getCoupon,
    creatCoupon,
    deleteCoupon,
} = require("../controller/coupon");

router.get("/:coupon", getCoupon);
router.post("/", creatCoupon);
router.delete("/:id", deleteCoupon);



module.exports = router;
