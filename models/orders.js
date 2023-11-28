const mongoose = require("mongoose");

const orderProductSchema = mongoose.Schema(
  {
    _id: String,
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minLength: [3, "short product title"],
      maxLength: [80, "long product title"],
    },
    title_ar: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minLength: [3, "short product title"],
      maxLength: [80, "long product title"],
    },
    description: {
      type: String,
      required: true,
      minLength: [20, "short product description"],
    },
    description_ar: {
      type: String,
      required: true,
      minLength: [20, "short product description"],
    },
    quantity: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      trim: true,
      max: [200000, "long product price"],
    },
    discountPercentage: {
      type: Number,
    },
    priceAfterDescount: {
      type: Number,
    },
    colors: [String],
    thumbnail: {
      type: String,
    },
    images: [String],
    category: {
      type: String,
      ref: "category",
      required: true,
    },
    subcategory: {
      type: String,
      ref: "subcategory",
      required: true,
    },
    brand: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "brand",
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    ratingQuantity: {
      type: Number,
      default: 0,
    },
    skus: [
      {
        name: {
          type: String,
        },
        features: [{}],
        price: {
          type: Number,
        },
        color: [String],
      },
    ],
  },
  { timestamps: true }
);

const ordersSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "users",
    },
    paymentStatus: {
      type: String,
      default: "Cash on delivery",
      enum: ["Cash on delivery", "paid", "Refunded"],
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
  },
  { timestamps: true }
);

var ordersModel = mongoose.model("orders", ordersSchema);

module.exports = ordersModel;
