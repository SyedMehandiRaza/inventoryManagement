const router = require("express").Router();
const customerController = require("../controllers/customer.controller");
const { verifyToken, checkRole } = require("../../middlewares/auth.middleware");

router.post("/register", customerController.register);
router.post("/login", customerController.login);
router.get(
  "/products/:companyId", 
  verifyToken, 
  customerController.getProducts
);
router.post(
  "/purchase",
  verifyToken,
  checkRole("customer"),
  customerController.purchase
);
router.get(
  "/orders",
  verifyToken,
  checkRole("customer"),
  customerController.getMyOrders
);

module.exports = router;
