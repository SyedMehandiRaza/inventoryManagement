// const router = require('express').Router();
// const productController = require('../controllers/product.controller');
// const { verifyToken } = require('../../middlewares/auth.middleware');

// router.post('/add', verifyToken, productController.addProduct);
// router.get('/company/:companyId', productController.getProductsByCompany);

// module.exports = router;

const router = require("express").Router();
const productController = require("../controllers/product.controller");
const { verifyToken } = require("../../middlewares/auth.middleware");
const { checkPermission } = require("../../middlewares/auth.middleware");

// Add Product
router.post(
  "/add",
  verifyToken,
  checkPermission("canAddProduct"),
  productController.addProduct
);

// Update Product
router.put(
  "/:id",
  verifyToken,
  checkPermission("canUpdateProduct"),
  productController.updateProduct
);

// Delete Product
router.delete(
  "/:id",
  verifyToken,
  checkPermission("canDeleteProduct"),
  productController.deleteProduct
);

// View Products by Company
router.get(
  "/company/:companyId",
  verifyToken,
  checkPermission("canViewProduct"),
  productController.getProductsByCompany
);

module.exports = router;
