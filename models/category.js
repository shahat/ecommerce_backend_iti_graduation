const mongoose = require("mongoose");
const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      minLength: [2, "too short category name"],
      maxLength: [32, "too long category name"],
    },
    img: {
      type: String,
    },
  },
  { timestamps: true }
);

var categoryModel = mongoose.model("category", categorySchema);
module.exports = categoryModel;
