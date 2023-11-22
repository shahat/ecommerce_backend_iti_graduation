var productModel = require(`../models/product`);

/* ================================  save product ================================ */

var saveProduct = async (req, res) => {
  var product = req.body;
  try {
    var newProduct = await productModel.create(product);
    res
      .status(200)
      .json({ message: "your product is created", data: newProduct });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================================ get proudect  ================================*/

let query = {};
const getProducts = async (req, res) => {
  try {
    // filter
    let mongooseQuery = productModel.find(query);
    // this funciton for retrive aall products length
    // async function getLengthOfProducts() {
    //   const products = await mongooseQuery.toArray();
    //   const length = products.length;
    //   return length;
    // }

    // const length = await getLengthOfProducts();
    // conosle.log("length", length);
    console.log(
      "product count ",
      await productModel.find(query).countDocuments()
    );

    // Filtering and excluding query parameters
    const {
      page,
      limit,
      sort,
      fields,
      keyword,
      priceMin,
      priceMax,
      color,
      lng,

      ...filters
    } = req.query;

    // handle localization
    // console.log("currentLanguageCode", lng);

    const titleField = lng === "ar" ? "title_ar" : "title";
    const descriptionField = lng === "ar" ? "description_ar" : "description";
    mongooseQuery = mongooseQuery.select(
      `${titleField} ${descriptionField} price priceAfterDescount images`
    );

    for (const key in filters) {
      mongooseQuery = mongooseQuery.where(key, filters[key]);
    }

    // Pagination
    const currentPage = parseInt(page) || 1;
    const perPage = parseInt(limit) || 12;
    const skip = (currentPage - 1) * perPage;

    mongooseQuery = mongooseQuery.skip(skip).limit(perPage);
    // .find(JSON.parse(queryStr));
    //
    // Sorting
    if (sort) {
      mongooseQuery = mongooseQuery.sort(sort.split(",").join(" "));
    } else {
      mongooseQuery = mongooseQuery.sort("-createdAt");
    }

    // Field selection
    if (fields) {
      mongooseQuery = mongooseQuery.select(fields.split(",").join(" "));
    } else {
      mongooseQuery = mongooseQuery.select("-__v");
    }

    if (priceMin && priceMax) {
      mongooseQuery = mongooseQuery.where("price").gte(priceMin).lte(priceMax);
    }
    if (color) {
      const colorsArray = Array.isArray(color) ? color : [color];
      mongooseQuery = mongooseQuery.where("colors").in(colorsArray);
    }

    // Search & localizaion
    if (keyword) {
      const keywordRegex = new RegExp(keyword, "i"); // Case-insensitive search
      mongooseQuery = mongooseQuery.or([
        { title_ar: keywordRegex },
        { title: keywordRegex },
        { description: keywordRegex },
        { description_ar: keywordRegex },
      ]);
    }

    const products = await mongooseQuery.exec();

    res
      .status(200)
      .json({ results: products.length, page: currentPage, data: products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/* ================================ get proudect by id ================================*/

var getProductById = async (req, res) => {
  var { id } = req.params;
  try {
    var product = await productModel.findOne({ _id: id });
    res.status(200).json({ data: product });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* ================================ update product ================================  */

var updateProduct = async (req, res) => {
  var { id } = req.params;
  try {
    var updatedProduct = await productModel.updateOne({ _id: id }, req.body);
    res.status(200).json({ message: "your product is updated" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/* ================================ Delete product ================================  */

var deletProduct = async (req, res) => {
  var { id } = req.params;
  try {
    await productModel.deleteOne({ _id: id });
    res.status(200).json({ message: "your product is deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  getProducts,
  saveProduct,
  getProductById,
  updateProduct,
  deletProduct,
};
