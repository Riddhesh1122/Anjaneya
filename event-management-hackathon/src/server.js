const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');

const connectDB = require('./config/db');
const apiRoutes = require('./routes');

dotenv.config();

// Connect Database (non-blocking if MONGO_URI is missing)
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// API Routes
app.use('/api', apiRoutes);

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, '../public')));

// Home route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/login.html'));
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
