var express = require(`express`);
var router = express.Router();
var productController = require(`../controller/product`);
const { protect } = require("../controller/authController");

router.get(`/`, productController.getProducts);
router.post(`/`, productController.saveProduct);
router.get("/:id", productController.getProductById);
router.patch("/:id", productController.updateProduct);
router.delete("/:id", productController.deletProduct);

module.exports = router;
