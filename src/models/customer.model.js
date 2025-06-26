const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  phone: String,
  company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
  purchases: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: Number,
      date: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model("Customer", customerSchema);
