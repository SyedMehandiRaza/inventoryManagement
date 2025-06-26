const Product = require("../models/product.model");

exports.addProduct = async (req, res) => {
  const { name, price, quantity, company } = req.body;
  const user = req.user;

  try {
    // Check if user's company exists
    if (!user.company) {
      return res
        .status(400)
        .json({ message: "User does not belong to any company." });
    }

    // Check if employee is trying to add product in wrong company
    if (user.company.toString() !== company.toString()) {
      return res
        .status(403)
        .json({ message: "You can only add products to your own company." });
    }

    const product = await Product.create({
      name,
      price,
      quantity,
      company,
      addedBy: user.id,
    });

    res.status(201).json({ message: "Product added successfully.", product });
  } catch (err) {
    console.error(" Error in addProduct:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.getProductsByCompany = async (req, res) => {
  try {
    const user = req.user;

    if (!user.company) {
      return res
        .status(400)
        .json({ message: "User does not belong to any company." });
    }

    const { companyId } = req.params;

    if (user.company.toString() !== companyId.toString()) {
      return res
        .status(403)
        .json({
          message: "You are not allowed to view products from another company.",
        });
    }

    const products = await Product.find({ company: companyId });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, quantity } = req.body;
    const user = req.user;

    // Find the product by ID
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // check if the user belongs to the same company
    if (
      user.role !== "superadmin" &&
      user.role !== "admin" &&
      (!user.company || product.company.toString() !== user.company.toString())
    ) {
      return res
        .status(403)
        .json({
          message: "You can only update products from your own company.",
        });
    }

    // Update the product
    product.name = name || product.name;
    product.price = price || product.price;
    product.quantity = quantity || product.quantity;

    await product.save();

    res.json({ message: "Product updated", product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    // Find the product by ID
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Check if the employee belongs to the same company
    if (user.role !== "superadmin" && user.role !== "admin") {
      if (
        !user.company ||
        product.company.toString() !== user.company.toString()
      ) {
        return res
          .status(403)
          .json({
            message: "You can only delete products from your own company.",
          });
      }
    }

    // Delete the product
    await Product.findByIdAndDelete(id);
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
