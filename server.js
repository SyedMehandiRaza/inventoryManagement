const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/users', require('./src/routes/user.route'));
app.use('/api/company', require('./src/routes/company.route'));
app.use('/api/customers', require('./src/routes/customer.route'));
app.use('/api/product', require('./src/routes/product.route'));

app.get('/', (req, res) => res.send("Inventory Management Backend Running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
