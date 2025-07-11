const router = require("express").Router();
const userController = require("../controllers/user.controller");
const { verifyToken } = require("../../middlewares/auth.middleware");

router.post("/register", verifyToken, userController.register);
router.post("/login", userController.login);

module.exports = router;
