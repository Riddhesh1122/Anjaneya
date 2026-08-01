const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(express.json());

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/event-management-hackathon';
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => console.log('Connected to MongoDB'))
	.catch(err => console.error('MongoDB connection error:', err));

// Serve static frontend
app.use(express.static(path.join(__dirname, '../public')));

// Simple API placeholder
app.get('/api/ping', (req, res) => res.json({ ok: true, time: Date.now() }));

// Mount routes: users, events, registrations
const apiRouter = require('./routes');
app.use('/api', apiRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
