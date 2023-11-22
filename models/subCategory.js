const mongoose = require("mongoose");

const subcategorySchema = mongoose.Schema(
  {
    _id: {
      type: String, // Set the _id field as a String
    },
    name: {
      type: String,
      required: true,
      unique: true,
      minLength: [2, "too short subcategory name"],
      maxLength: [32, "too long subcategory name"],
    },
    name_ar: {
      type: String,
      required: true,
      unique: true,
      minLength: [2, "too short subcategory name"],
      maxLength: [32, "too long subcategory name"],
    },
    image: {
      type: String,
    },
    parentCategory: {
      type: String,
      ref: "category",
      required: true,
    },
  },
  { timestamps: true }
);

// Define a pre-save middleware to set the _id based on the name
subcategorySchema.pre("save", function (next) {
  this._id = this.name; // Set _id to the value of the name field
  next();
});

const subcategoryModel = mongoose.model("subcategory", subcategorySchema);
module.exports = subcategoryModel;
