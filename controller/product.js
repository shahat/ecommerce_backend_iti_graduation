const { title } = require("process");
var productModel = require(`../models/product`);
const { log } = require("console");
const { json } = require("stream/consumers");
const { match } = require("assert");

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

/* ================================  get products on page (pagination) ================================ */

var getProducts = async (req, res) => {
  //filter
  //equale
  var queryStringObj = { ...req.query };
  console.log("ay kalam ");
  var excludesFieldes = [`page`, `sort`, `limit`, `fields`];
  excludesFieldes.forEach((field) => delete queryStringObj[field]);
  // console.log(queryStringObj);
  //($gte) , ($lte) ,($gt),($lt)
  let queryStr = JSON.stringify(queryStringObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
  // console.log(queryStringObj);
  // console.log(JSON.parse(queryStr));

  try {
    //pagenation
    var page = parseInt(req.query.page) || 1;
    var limit = parseInt(req.query.limit) || 9;
    var skip = (page - 1) * limit;
    //build query

    var mongooseQuery = productModel
      .find(JSON.parse(queryStr))
      .skip(skip)
      .limit(limit);
    // .populate({ path: `categoryId`, select: `name` });

    /* ================================  Sorting  ================================ */
    if (req.query.sort) {
      var sortQuery = req.query.sort.split(`,`).join(` `);
      mongooseQuery = mongooseQuery.sort(sortQuery);
    } else {
      mongooseQuery = mongooseQuery.sort(`-createdAt`);
    }

    /* ================================ fields limiting ================================ */

    if (req.query.fields) {
      var fields = req.query.fields.split(`,`).join(` `);
      mongooseQuery = mongooseQuery.select(fields);
    } else {
      mongooseQuery = mongooseQuery.select(`-__v`);
    }

    /* ================================ Search ================================*/

    if (req.query.keyword) {
      console.log(req.query.keyword);
      var query = {};
      query.$or = [
        { title: req.query.keyword },
        { description: req.query.keyword },
      ];
      console.log(query);
      mongooseQuery = mongooseQuery.find(query);
    }
    var products = await mongooseQuery;
    res.status(200).json({ results: products.length, page, data: products });
  } catch (err) {
    res.status(404).json({ message: err.message });
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
