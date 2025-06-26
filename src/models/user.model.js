// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//   name: String,
//   email: { type: String, unique: true },
//   password: String,
//   role: {
//     type: String,
//     enum: ['superadmin', 'admin', 'manager', 'hr', 'salesperson', 'tl']
//   },
//   createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//   company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', default: null }
// });

// module.exports = mongoose.model('User', userSchema);

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    unique: true,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    default: "employee", // Can be any string like "TL", "Sales", "Worker"
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    default: null,
  },

  permissions: {
    type: [String],
    default: [],
  },
});

module.exports = mongoose.model("User", userSchema);
