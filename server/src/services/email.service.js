const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
require('dotenv').config();

let nodemailer;
try {
  nodemailer = require('nodemailer');
} catch (e) {
  nodemailer = null;
}

const systemAuditLogs = [];

/**
 * Creates Nodemailer SMTP Transporter or returns null for fallback logger driver
 */
function createTransporter() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (nodemailer && host && user && pass) {
    return nodemailer.createTransport({
      host,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: { user, pass },
    });
  }

  return null;
}

/**
 * Dispatches an email asynchronously with retries & fallback driver
 */
async function sendEmail({ to, subject, html, text, maxRetries = 3 }) {
  if (!to || !subject || !html) {
    console.warn('[Email Service] Missing required params (to, subject, html)');
    return { success: false, error: 'Missing email params' };
  }

  const from = process.env.EMAIL_FROM || '"Anjaneya Platform" <notifications@anjaneya.org>';
  const logRecord = {
    id: `email-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    to,
    subject,
    timestamp: new Date().toLocaleTimeString(),
    status: 'pending',
  };

  // Asynchronous Non-blocking Execution via setImmediate
  setImmediate(async () => {
    const transporter = createTransporter();

    if (transporter) {
      let attempt = 0;
      let sent = false;

      while (attempt < maxRetries && !sent) {
        attempt++;
        try {
          await transporter.sendMail({
            from,
            to,
            subject,
            html,
            text: text || subject,
          });
          sent = true;
          logRecord.status = 'delivered';
          console.log(`[SMTP EMAIL DISPATCHED] To: ${to} | Subject: "${subject}"`);
        } catch (err) {
          console.warn(`[SMTP DISPATCH ATTEMPT ${attempt} FAILED] To: ${to}:`, err.message);
          if (attempt < maxRetries) {
            await new Promise(r => setTimeout(r, 1000 * attempt)); // Exponential backoff
          }
        }
      }

      if (!sent) {
        logRecord.status = 'failed';
        console.error(`[EMAIL DISPATCH FAILED PERMANENTLY] To: ${to}`);
      }
    } else {
      // Fallback Development Simulated Driver
      logRecord.status = 'simulated';
      console.log(`\n======================================================`);
      console.log(`[EMAIL DISPATCH SIMULATED (DEV DRIVER)]`);
      console.log(`FROM:    ${from}`);
      console.log(`TO:      ${to}`);
      console.log(`SUBJECT: ${subject}`);
      console.log(`TIME:    ${logRecord.timestamp}`);
      console.log(`======================================================\n`);
    }

    systemAuditLogs.unshift(logRecord);
    if (systemAuditLogs.length > 50) systemAuditLogs.pop();
  });

  return { success: true, message: 'Email queued for background dispatch' };
}

function getEmailAuditLogs() {
  return systemAuditLogs;
}

module.exports = {
  sendEmail,
  getEmailAuditLogs,
};
