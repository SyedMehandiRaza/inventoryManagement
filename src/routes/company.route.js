const router = require('express').Router();
const companyController = require('../controllers/company.controller');
const { verifyToken, checkRole } = require('../../middlewares/auth.middleware');

router.post('/create', verifyToken, checkRole('admin'), companyController.createCompany);
router.post('/add-admin', verifyToken, checkRole('superadmin'), companyController.addAdminToCompany);

module.exports = router;
