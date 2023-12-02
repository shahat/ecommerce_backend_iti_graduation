const mongoose = require("mongoose");

const reviewsSchema = mongoose.Schema(
  {
    productId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "product",
    },
    userId: {
      type: mongoose.SchemaTypes.String,
      ref: "users",
    },
    rating: {
      type: Number,
      enum: [1, 2, 3, 4, 5],
    },
    name: {
      type: String,
      minLength: [3, "short product title"],
      maxLength: [50, "long product title"],
    },
    reviewTitle: {
      type: String,
      minLength: [3, "short product title"],
      maxLength: [50, "long product title"],
    },
    comment: {
      type: String,
      minLength: [3, "short product title"],
      maxLength: [250, "long product title"],
    },
  },
  { timestamps: true }
);

var reviewsModel = mongoose.model("reviews", reviewsSchema);

module.exports = reviewsModel;
