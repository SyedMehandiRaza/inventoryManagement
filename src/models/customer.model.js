const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
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
