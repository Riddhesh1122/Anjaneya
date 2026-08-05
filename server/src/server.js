const dotenv = require('dotenv');
dotenv.config();
const { app, server } = require('./app');
const connectDB = require('./config/db');
const { logger } = require('./utils');
const { DEFAULT_CONFIG } = require('./constants');

// Fail fast if critical secrets are missing.
if (!process.env.JWT_SECRET) {
  logger.error('Missing JWT_SECRET environment variable.\nPlease set JWT_SECRET in your .env or environment before starting the server.\nServer will exit.');
  process.exit(1);
}

const PORT = process.env.PORT || DEFAULT_CONFIG.DEFAULT_PORT;

const startServer = async () => {
  try {
    await connectDB();
  } catch (err) {
    logger.warn('Failed to connect to MongoDB. Server is running without a database connection. Set MONGO_URI in .env or run local MongoDB to enable database features.');
  }

  server.listen(PORT, () => {
    logger.info(`Server running on http://localhost:${PORT}`);
  });
};

startServer();