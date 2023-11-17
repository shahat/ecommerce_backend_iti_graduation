const mongoose = require("mongoose");


const coupons = mongoose.Schema(
  {
    coupon : {
        type : String,
        required : true,
        minLength: 4,
        maxLenght : 8
    },
    discount : {
        type : Number,
        required : true,
    }
  },
  { timestamps: true }
);



module.exports = mongoose.model("coupons", coupons);
