// To connect backend server to MongoDB Atlas
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config(); // Load env variables

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Atlas connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// User Schema and Model
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String
});
const User = mongoose.model('User', userSchema);

// Product Schema and Model
const productSchema = new mongoose.Schema({
  name: String,
  price: String,
  showPrice: Boolean,
  features: String,
  category: String,
  images: [String],
  primary: Number
});
const Product = mongoose.model('Product', productSchema);

// Signup Route
app.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ message: 'Email already registered' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashedPassword });
  await user.save();
  res.json({ message: 'Signup successful' });
});

// Login Route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

  res.json({ message: 'Login successful', name: user.name, email: user.email });
});

// ✅ Products Route with optional category search (Atlas Search)
app.get('/products', async (req, res) => {
  const { category } = req.query;

  try {
    if (category) {
      const results = await Product.aggregate([
        {
          $search: {
            index: 'category', // Name of your search index in MongoDB Atlas
            text: {
              query: category,
              path: 'category',
              fuzzy: {} // Optional typo-tolerance
            }
          }
        }
      ]);
      return res.json(results);
    } else {
      const products = await Product.find();
      res.json(products);
    }
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
});

// Serve frontend static files
app.use(express.static(path.join(__dirname, 'public')));

// Fallback for frontend routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Start server
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
















//  To connect localhost:5000 server to MongoDB compass
// const express = require('express');
// const cors = require('cors');
// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

// const app = express();
// const PORT = 5000;

// app.use(cors());
// app.use(express.json());

// mongoose.connect('mongodb://127.0.0.1:27017/ope_auth', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// });

// const userSchema = new mongoose.Schema({
//   name: String,
//   email: { type: String, unique: true },
//   password: String
// });

// const User = mongoose.model('User', userSchema);

// app.post('/signup', async (req, res) => {
//   const { name, email, password } = req.body;
//   const userExists = await User.findOne({ email });
//   if (userExists) return res.status(400).json({ message: 'Email already registered' });

//   const hashedPassword = await bcrypt.hash(password, 10);
//   const user = new User({ name, email, password: hashedPassword });
//   await user.save();
//   res.json({ message: 'Signup successful' });
// });

// app.post('/login', async (req, res) => {
//   const { email, password } = req.body;
//   const user = await User.findOne({ email });
//   if (!user) return res.status(401).json({ message: 'Invalid credentials' });

//   const valid = await bcrypt.compare(password, user.password);
//   if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

//   res.json({ message: 'Login successful', email: user.email });
// });

// const path = require('path');
// app.use(express.static(path.join(__dirname, 'public')));


// app.use(express.static(path.join(__dirname, 'public')));
// app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
