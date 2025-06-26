const User = require("../models/user.model");
const Company = require("../models/company.model");
const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const VALID_PERMISSIONS = [
  "canAddProduct",
  "canDeleteProduct",
  "canUpdateProduct",
  "canViewProduct",
];

exports.register = async (req, res) => {
  const { name, email, password, role, company, permissions } = req.body;
  const creator = req.user;

  try {
    //  Validate company existence if provided
    if (company) {
      const companyExists = await Company.findById(company);
      if (!companyExists) {
        return res.status(400).json({ message: "Invalid company ID" });
      }
    }

    //  Only superadmin can create admin
    if (role === "admin" && creator.role !== "superadmin") {
      return res
        .status(403)
        .json({ message: "Only superadmin can create admins" });
    }

    //  Admin creating employee: company is required
    if (creator.role === "admin" && role !== "admin") {
      if (!company) {
        return res
          .status(400)
          .json({ message: "Company is required when admin creates employee" });
      }
    }

    //  Validate permissions
    if (Array.isArray(permissions)) {
      const invalid = permissions.filter((p) => !VALID_PERMISSIONS.includes(p));
      if (invalid.length > 0) {
        return res
          .status(400)
          .json({ message: `Invalid permissions: ${invalid.join(", ")}` });
      }
    }

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const hash = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hash,
      role,
      createdBy: creator._id,
      company: company || null,
      permissions: permissions || [],
    });

    res.status(201).json({ message: "User created", user: newUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        permissions: user.permissions || [],
        company: user.company || null,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ message: "Login successful", token, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
