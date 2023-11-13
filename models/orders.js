const mongoose = require("mongoose");

const orderProductSchema = mongoose.Schema({
  productId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "product",
  }
  
})


const ordersSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "users",
    },
    paymentStatus: {
      type: String,
      default: "processed",
      enum: ["processed", "in progress", "completed"],
    },
    status: {
      type: String,
      default: "Waiting for Supplier",
      enum: ["shipped", "Waiting for Supplier"],
    },
    amount: {
      type: Number,
    },
    items: [orderProductSchema],
    shippingAddress: {
      type: Object,
    },
    billingAddress: {
      type: Object,
    },
  },
  { timestamps: true }
);

var ordersModel = mongoose.model("orders", ordersSchema);

module.exports = ordersModel;
