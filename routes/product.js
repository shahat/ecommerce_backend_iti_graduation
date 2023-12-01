var express = require(`express`);
var router = express.Router();
var productController = require(`../controller/product`);
const { tokenValidate } = require("../middlewares/isTokenValid");
// const { protect } = require("../controller/authController");

router.get(`/`, productController.getProducts);
router.get(`/perMonth`, tokenValidate, productController.productsCreatedPerMonth);
router.post(`/`, tokenValidate, productController.saveProduct);
router.get("/:id", productController.getProductById);
router.patch("/:id", tokenValidate, productController.updateProduct);
router.delete("/:id", tokenValidate, productController.deletProduct);

module.exports = router;
