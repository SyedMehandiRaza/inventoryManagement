const Customer = require('../models/customer.model');
const Product = require('../models/product.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


exports.register = async (req, res) => {
  const { name, email, password, phone, company } = req.body;

  try {
    const existing = await Customer.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Customer already exists' });

    const hash = await bcrypt.hash(password, 10);
    const customer = await Customer.create({
      name,
      email,
      password: hash,
      phone,
      company
    });

    res.status(201).json({ message: 'Customer registered', customer });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const customer = await Customer.findOne({ email });
    if (!customer) return res.status(404).json({ message: 'Customer not found' });

    const match = await bcrypt.compare(password, customer.password);
    if (!match) return res.status(400).json({ message: 'Invalid password' });

    const token = jwt.sign({ id: customer._id, role: 'customer' }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });

    console.log("JWT_SECRET in LOGIN:", process.env.JWT_SECRET);

    res.json({ message: 'Login successful', token, customer });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const { companyId } = req.params;
    const products = await Product.find({ company: companyId });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.purchase = async (req, res) => {
  const { productId, quantity, companyId } = req.body;
  const customerId = req.user.id;

  try {
    // Input validation
    if (!productId || !quantity || !companyId) {
      return res.status(400).json({ message: 'Product ID, quantity, and company ID are required' });
    }

    if (typeof quantity !== 'number' || quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be a positive number greater than 0' });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Check if product belongs to requested company
    if (!product.company || product.company.toString() !== companyId.toString()) {
      return res.status(403).json({ message: 'Product does not belong to this company' });
    }

    // Check if product has enough quantity
    if (quantity > product.quantity) {
      return res.status(400).json({ message: 'Not enough stock available' });
    }

    // Reduce stock and add to customer's purchases
    await Customer.findByIdAndUpdate(customerId, {
      $push: { purchases: { product: productId, quantity } }
    });

    product.quantity -= quantity;
    await product.save();

    res.json({ message: 'Purchase successful' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getMyOrders = async (req, res) => {
  try {
    const customer = await Customer.findById(req.user.id).populate('purchases.product');
    res.json(customer.purchases);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
