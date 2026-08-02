const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const required = ['JWT_SECRET', 'MONGO_URI', 'PORT', 'CLIENT_URL'];

const missing = required.filter((k) => !process.env[k]);

if (missing.length > 0) {
  console.error('Missing required environment variables:');
  missing.forEach((m) => console.error(`  - ${m}`));
  process.exit(1);
} else {
  console.log('All required environment variables are present.');
  process.exit(0);
}
