const Company = require('../models/company.model');

exports.createCompany = async (req, res) => {
  const { name } = req.body;
  try {
    const company = await Company.create({ name, admins: [req.user.id] });
    res.status(201).json({ message: 'Company created', company });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find();
    res.json(companies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addAdminToCompany = async (req, res) => {
  const { companyId, adminId } = req.body;
  try {
    const company = await Company.findByIdAndUpdate(
      companyId,
      { $addToSet: { admins: adminId } },
      { new: true }
    );
    res.json({ message: 'Admin added to company', company });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
