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

/* ================================  get products on page (pagination) ================================ */

// var getProducts = async (req, res) => {
//   //filter
//   //equale

//   console.log("this is req query ", req.query);
//   var queryStringObj = { ...req.query };

//   console.log("ay kalam ");

//   var excludesFieldes = [`page`, `sort`, `limit`, `fields`];

//   excludesFieldes.forEach((field) => delete queryStringObj[field]);

//   // console.log(queryStringObj);
//   //($gte) , ($lte) ,($gt),($lt)

//   let queryStr = JSON.stringify(queryStringObj);
//   queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
//   // console.log(queryStringObj);
//   // console.log(JSON.parse(queryStr));

//   try {
//     //pagenation
//     var page = parseInt(req.query.page) || 1;
//     var limit = parseInt(req.query.limit) || 9;
//     var skip = (page - 1) * limit;

//     //build query
//     var mongooseQuery = productModel
//       .find(JSON.parse(queryStr))
//       .skip(skip)
//       .limit(limit);
//     // .populate({ path: `categoryId`, select: `name` });

//     /* ================================  Sorting  ================================ */
//     if (req.query.sort) {
//       var sortQuery = req.query.sort.split(`,`).join(` `);
//       mongooseQuery = mongooseQuery.sort(sortQuery);
//     } else {
//       mongooseQuery = mongooseQuery.sort(`-createdAt`);
//     }

//     /* ================================ fields limiting ================================ */

//     if (req.query.fields) {
//       var fields = req.query.fields.split(`,`).join(` `);
//       mongooseQuery = mongooseQuery.select(fields);
//     } else {
//       mongooseQuery = mongooseQuery.select(`-__v`);
//     }

//     /* ================================ Search ================================*/

//     if (req.query.keyword) {
//       let keyword = req.query.keyword;
//       console.log("this is the query ", req.query.keyword);
//       const query = {
//         $or: [
//           { title: { $regex: keyword, $options: "i" } }, // Case-insensitive search
//           { description: { $regex: keyword, $options: "i" } }, // Case-insensitive search
//         ],
//       };
//       mongooseQuery = mongooseQuery.where(query);

//       // console.log("hhhhhhhhhhhhhhhhh", query);
//       // mongooseQuery = mongooseQuery.find(query);
//     }

//     // var products = await mongooseQuery;
//     const products = await mongooseQuery.exec(); // Execute the query
//     console.log("after finding products", products);
//     res.status(200).json({ results: products.length, page, data: products });
//   } catch (err) {
//     res.status(404).json({ message: err.message });
//   }
// };
// ================================================

const getProducts = async (req, res) => {
  //  filter
  // equale

  // var queryStringObj = { ...req.query };
  // var excludesFieldes = [`page`, `sort`, `limit`, `fields`];

  // excludesFieldes.forEach((field) => delete queryStringObj[field]);
  // let queryStr = JSON.stringify(queryStringObj);
  // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

  try {
    let mongooseQuery = productModel.find(); // Replace `productModel` with your actual Mongoose model.

    // Filtering and excluding query parameters
    const { page, limit, sort, fields, keyword, ...filters } = req.query;

    // Apply filters (excluding pagination, sorting, fields, and cd)
    for (const key in filters) {
      mongooseQuery = mongooseQuery.where(key, filters[key]);
    }

    // Pagination
    const currentPage = parseInt(page) || 1;
    const perPage = parseInt(limit) || 10;
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

    // Search
    if (keyword) {
      const keywordRegex = new RegExp(keyword, "i"); // Case-insensitive search
      mongooseQuery = mongooseQuery.or([
        { title: keywordRegex },
        { description: keywordRegex },
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
