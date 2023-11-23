const subCategoryModel = require("../models/subCategory");
const productModel = require("../models/product");
const asyncHandler = require("express-async-handler");

const setCategoryIdToBody = (req, res, next) => {
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};

// =====================< createSubCategory >=====================<
// @desc   Create subCategory
// @route  POST /subcategories
// @access Private
const createSubCategory = asyncHandler(async (req, res) => {
  // Nested route
  if (!req.body.category) req.body.category = req.params.categoryId;
  const { name, parentCategory, image, name_ar } = req.body;
  const subCategory = await subCategoryModel.create({
    name,
    parentCategory,
    image,
    name_ar,
  });
  res.status(201).json({
    message: "subCategory has been created succesfully",
    data: subCategory,
  });
});

// =====================< getSubCategories >=====================<
// @route  GET /categories/:categoryId/subcategories
// @desc   Get list of subCategories
// @route  GET /subcategories
// @access Public

const getSubCategories = asyncHandler(async (req, res) => {
  const { lng } = req.query;
  let nameField = lng == "ar" ? " name name_ar" : "name";
  console.log("lng from subcategory ", lng);
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 20;
  const skip = (page - 1) * limit;

  let filterObject = {};
  if (req.params.categoryId) filterObject = { category: req.params.categoryId };

  const returnedSubCategory = await subCategoryModel
    .find(filterObject)
    .select(`${nameField} image parentCategory`)
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    result: returnedSubCategory.length,
    page,
    data: returnedSubCategory,
  });
});

// =====================< subcategoryProducts >=====================<

const subcategoryProducts = async (req, res) => {
  const subcategory = req.params.id;
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 3;
  const skip = (page - 1) * limit;
  const subcategoryProduct = await productModel
    .find({ subcategory: subcategory })
    .skip(skip)
    .limit(limit);
  res.status(200).json({
    result: subcategoryProduct.length,
    page,
    data: subcategoryProduct,
  });
};

// =====================< getSubCategories >=====================<

// @desc    Get specific subCategory by ID
// @route   GET /subcategories/:id
// @access  Public

const getSubCategoryById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const category = await subCategoryModel
      .findById(id)
      // .populate({ path: "parentCategory", select: "name" })
      .exec();
    category
      ? res
          .status(200)
          .json({ message: "Category is retrieved", data: category })
      : res.status(404).json(`No category found for ${id}`);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// =====================< updateSubCategory >=====================<
// @desc   update specific subCategory
// @route  PATCH /subcategories/:id
// @access Private
// new:true -> to return the updated category, NOT before the update.

const updateSubCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, category } = req.body;
  const subCategory = await subCategoryModel.findOneAndUpdate(
    { _id: id },
    { name, category },
    { new: true }
  );
  subCategory
    ? res.status(200).json({
        message: "Subcategory is updated successfully",
        data: subCategory,
      })
    : res.status(404).json({ message: `No category for this id ${id}` });
});

// =====================< deleteSubCategory >=====================<
// @desc   Delete specific subCategory
// @route  DELETE /subcategories/:id
// @access Private

const deleteSubCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const deletedSubCategory = await subCategoryModel.findByIdAndDelete({
    _id: id,
  });
  deletedSubCategory
    ? res.status(200).json({
        message: "Subcategory has been deleted successfully",
      })
    : res.status(404).json({ message: `No category for this ${id}` });
});

module.exports = {
  createSubCategory,
  getSubCategories,
  getSubCategoryById,
  updateSubCategory,
  setCategoryIdToBody,
  subcategoryProducts,
  deleteSubCategory,
};
