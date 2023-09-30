const mongoose = require("mongoose");

const subCategorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      minLength: [2, "too short subcategory name"],
      maxLength: [32, "too long subcategory name"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
      required: [true, " please enter the category "],
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("subCategory", subCategorySchema);
