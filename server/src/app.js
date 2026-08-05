const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const morgan = require('morgan');
const apiRoutes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const { AppError, logger } = require('./utils');
const { HTTP_STATUS, MESSAGES } = require('./constants');
const http = require('http');
const { Server } = require('socket.io');

const app = express();

// Core middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// API routes
app.use('/api', apiRoutes);

// Socket.io setup – expose the io instance on the app so controllers can emit events.
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL || 'http://localhost:5173' },
});
app.set('io', io);

// Serve the built client app.
const clientDistPath = path.join(__dirname, '../../client/dist');
const clientIndexPath = path.join(clientDistPath, 'index.html');
app.use(express.static(clientDistPath));

// Fallback for client routes and explicit 404s for missing API endpoints.
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next(new AppError(MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND));
  }

  if (!fs.existsSync(clientIndexPath)) {
    logger.warn('Client build not found. Run npm run client:build before starting the server.');
    return res.status(HTTP_STATUS.NOT_FOUND).send('Frontend build not found. Run npm run client:build.');
  }

  return res.sendFile(clientIndexPath);
});

// Centralized error handling.
app.use(errorHandler);

module.exports = { app, server, io };