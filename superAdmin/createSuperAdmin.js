const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../src/models/user.model');

dotenv.config();
mongoose.connect(process.env.MONGO_URI).then(async () => {
  const exists = await User.findOne({ email: "syed@owner.com" });
  if (exists) {
    console.log("Super Admin already exists");
    process.exit();
  }

  const hash = await bcrypt.hash("syed2105", 10);
  await User.create({
    name: "Syed Mehandi Raza",
    email: "syed@owner.com",
    password: hash,
    role: "superadmin"
  });

  console.log("Super Admin created");
  process.exit();
});
