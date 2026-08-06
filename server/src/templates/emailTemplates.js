/**
 * Responsive HTML Email Templates for Anjaneya Platform
 */

const BASE_STYLE = `
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  background-color: #09090b;
  color: #f4f4f5;
  padding: 32px 16px;
  margin: 0;
`;

const CONTAINER_STYLE = `
  max-width: 560px;
  margin: 0 auto;
  background-color: #18181b;
  border: 1px solid #27272a;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
`;

const HEADER_STYLE = `
  text-align: center;
  padding-bottom: 24px;
  border-bottom: 1px solid #27272a;
  margin-bottom: 24px;
`;

const CARD_STYLE = `
  background-color: #09090b;
  border: 1px solid #27272a;
  border-radius: 12px;
  padding: 20px;
  margin: 20px 0;
`;

const BUTTON_STYLE = `
  display: inline-block;
  background-color: #f59e0b;
  color: #09090b;
  font-weight: 800;
  font-size: 14px;
  padding: 12px 24px;
  border-radius: 10px;
  text-decoration: none;
  margin-top: 16px;
`;

const FOOTER_STYLE = `
  text-align: center;
  font-size: 11px;
  color: #71717a;
  margin-top: 32px;
  border-top: 1px solid #27272a;
  padding-top: 20px;
`;

function wrapTemplate(title, bodyContent) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>${title}</title>
      </head>
      <body style="${BASE_STYLE}">
        <div style="${CONTAINER_STYLE}">
          <div style="${HEADER_STYLE}">
            <h2 style="margin: 0; font-size: 22px; font-weight: 900; color: #f59e0b; letter-spacing: -0.5px;">
              ANJANEYA
            </h2>
            <p style="margin: 4px 0 0 0; font-size: 12px; color: #a1a1aa;">Smart Event & Volunteer Platform</p>
          </div>

          ${bodyContent}

          <div style="${FOOTER_STYLE}">
            <p style="margin: 0;">Anjaneya Platform Inc. · Automated Email System</p>
            <p style="margin: 4px 0 0 0;">If you did not request this email, please contact support@anjaneya.org</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

// 1. Registration Confirmation
function getRegistrationConfirmationTemplate({ attendeeName, eventTitle, eventDate, location, ticketId }) {
  const content = `
    <h3 style="font-size: 18px; font-weight: 800; color: #ffffff; margin-top: 0;">
      🎉 Registration Confirmed!
    </h3>
    <p style="font-size: 14px; color: #d4d4d8; line-height: 1.6;">
      Hi <strong>${attendeeName}</strong>, your spot for <strong>${eventTitle}</strong> is officially secured!
    </p>

    <div style="${CARD_STYLE}">
      <p style="margin: 0 0 8px 0; font-size: 12px; font-weight: 700; color: #f59e0b; text-transform: uppercase;">Ticket Pass Summary</p>
      <p style="margin: 4px 0; font-size: 14px; color: #ffffff;"><strong>Event:</strong> ${eventTitle}</p>
      <p style="margin: 4px 0; font-size: 13px; color: #a1a1aa;"><strong>Date:</strong> ${eventDate}</p>
      <p style="margin: 4px 0; font-size: 13px; color: #a1a1aa;"><strong>Venue:</strong> ${location}</p>
      <p style="margin: 4px 0; font-size: 13px; color: #a1a1aa;"><strong>Ticket ID:</strong> <span style="font-family: monospace; color: #f59e0b;">${ticketId}</span></p>
    </div>

    <p style="font-size: 13px; color: #a1a1aa;">
      Your digital QR check-in pass is available under <strong>My Registrations</strong> on the Anjaneya dashboard. Present your pass at the entrance scanner.
    </p>

    <div style="text-align: center;">
      <a href="http://localhost:5173/dashboard" style="${BUTTON_STYLE}">View QR Ticket Pass</a>
    </div>
  `;
  return wrapTemplate(`Registration Confirmed - ${eventTitle}`, content);
}

// 2. Registration Status Change (Approved / Rejected / Waitlisted)
function getRegistrationStatusTemplate({ attendeeName, eventTitle, status, reason }) {
  const isApproved = status === 'Approved';
  const badgeColor = isApproved ? '#10b981' : status === 'Waitlisted' ? '#f59e0b' : '#ef4444';

  const content = `
    <h3 style="font-size: 18px; font-weight: 800; color: #ffffff; margin-top: 0;">
      Registration Status Update
    </h3>
    <p style="font-size: 14px; color: #d4d4d8; line-height: 1.6;">
      Hi <strong>${attendeeName}</strong>, your registration status for <strong>${eventTitle}</strong> has been updated to:
    </p>

    <div style="text-align: center; margin: 20px 0;">
      <span style="background-color: ${badgeColor}20; color: ${badgeColor}; border: 1px solid ${badgeColor}40; font-weight: 800; padding: 8px 16px; border-radius: 20px; font-size: 14px;">
        ${status.toUpperCase()}
      </span>
    </div>

    ${reason ? `<p style="font-size: 13px; color: #a1a1aa; background-color: #09090b; padding: 12px; border-radius: 8px; border: 1px solid #27272a;"><strong>Organizer Note:</strong> ${reason}</p>` : ''}

    <div style="text-align: center; margin-top: 24px;">
      <a href="http://localhost:5173/dashboard" style="${BUTTON_STYLE}">Open Dashboard</a>
    </div>
  `;
  return wrapTemplate(`Registration Status: ${status}`, content);
}

// 3. Event Reminder
function getEventReminderTemplate({ attendeeName, eventTitle, eventDate, location }) {
  const content = `
    <h3 style="font-size: 18px; font-weight: 800; color: #ffffff; margin-top: 0;">
      ⏰ Event Reminder: ${eventTitle}
    </h3>
    <p style="font-size: 14px; color: #d4d4d8; line-height: 1.6;">
      Hi <strong>${attendeeName}</strong>, this is a quick reminder that <strong>${eventTitle}</strong> is starting soon!
    </p>

    <div style="${CARD_STYLE}">
      <p style="margin: 4px 0; font-size: 13px; color: #a1a1aa;"><strong>Date & Time:</strong> ${eventDate}</p>
      <p style="margin: 4px 0; font-size: 13px; color: #a1a1aa;"><strong>Location:</strong> ${location}</p>
      <p style="margin: 8px 0 0 0; font-size: 12px; color: #f59e0b;">* Please arrive 15 minutes early with your digital QR pass ready for check-in.</p>
    </div>

    <div style="text-align: center;">
      <a href="http://localhost:5173/dashboard" style="${BUTTON_STYLE}">Open QR Ticket</a>
    </div>
  `;
  return wrapTemplate(`Reminder: ${eventTitle}`, content);
}

// 4. Event Update Email
function getEventUpdateTemplate({ attendeeName, eventTitle, updateDetails }) {
  const content = `
    <h3 style="font-size: 18px; font-weight: 800; color: #ffffff; margin-top: 0;">
      📢 Event Details Updated
    </h3>
    <p style="font-size: 14px; color: #d4d4d8; line-height: 1.6;">
      Hi <strong>${attendeeName}</strong>, the organizer has published an update for <strong>${eventTitle}</strong>:
    </p>

    <div style="${CARD_STYLE}">
      <p style="margin: 0; font-size: 13px; color: #f4f4f5; line-height: 1.6;">${updateDetails}</p>
    </div>

    <div style="text-align: center;">
      <a href="http://localhost:5173/dashboard" style="${BUTTON_STYLE}">View Updated Event</a>
    </div>
  `;
  return wrapTemplate(`Update for ${eventTitle}`, content);
}

// 5. Event Cancellation Email
function getEventCancellationTemplate({ attendeeName, eventTitle, reason }) {
  const content = `
    <h3 style="font-size: 18px; font-weight: 800; color: #ef4444; margin-top: 0;">
      ⚠️ Event Cancelled Notice
    </h3>
    <p style="font-size: 14px; color: #d4d4d8; line-height: 1.6;">
      Hi <strong>${attendeeName}</strong>, we regret to inform you that <strong>${eventTitle}</strong> has been cancelled by the organizer.
    </p>

    <div style="${CARD_STYLE}">
      <p style="margin: 0; font-size: 13px; color: #ef4444; font-weight: 700;">Reason for Cancellation:</p>
      <p style="margin: 4px 0 0 0; font-size: 13px; color: #a1a1aa;">${reason || 'Unforeseen administrative schedule changes.'}</p>
    </div>

    <p style="font-size: 13px; color: #a1a1aa;">If you paid a registration fee, a full refund will be automatically processed within 3-5 business days.</p>
  `;
  return wrapTemplate(`Cancelled: ${eventTitle}`, content);
}

// 6. Volunteer Assignment Email
function getVolunteerAssignmentTemplate({ volunteerName, eventTitle, role, status }) {
  const content = `
    <h3 style="font-size: 18px; font-weight: 800; color: #ffffff; margin-top: 0;">
      🤝 Volunteer Duty Assignment
    </h3>
    <p style="font-size: 14px; color: #d4d4d8; line-height: 1.6;">
      Hi <strong>${volunteerName}</strong>, you have been assigned to volunteer duty for <strong>${eventTitle}</strong>!
    </p>

    <div style="${CARD_STYLE}">
      <p style="margin: 4px 0; font-size: 14px; color: #ffffff;"><strong>Assigned Role:</strong> ${role}</p>
      <p style="margin: 4px 0; font-size: 13px; color: #a1a1aa;"><strong>Assignment Status:</strong> ${status}</p>
    </div>

    <div style="text-align: center;">
      <a href="http://localhost:5173/dashboard" style="${BUTTON_STYLE}">View Volunteer Duty Roster</a>
    </div>
  `;
  return wrapTemplate(`Volunteer Duty: ${eventTitle}`, content);
}

// 7. Certificate Ready Notification
function getCertificateReadyTemplate({ attendeeName, eventTitle }) {
  const content = `
    <h3 style="font-size: 18px; font-weight: 800; color: #10b981; margin-top: 0;">
      🎓 Your Certificate of Completion is Ready!
    </h3>
    <p style="font-size: 14px; color: #d4d4d8; line-height: 1.6;">
      Congratulations <strong>${attendeeName}</strong>! Having fulfilled attendance requirements for <strong>${eventTitle}</strong>, your official certificate has been generated.
    </p>

    <div style="text-align: center; margin-top: 24px;">
      <a href="http://localhost:5173/dashboard" style="${BUTTON_STYLE}">Download Certificate</a>
    </div>
  `;
  return wrapTemplate(`Certificate Ready - ${eventTitle}`, content);
}

module.exports = {
  getRegistrationConfirmationTemplate,
  getRegistrationStatusTemplate,
  getEventReminderTemplate,
  getEventUpdateTemplate,
  getEventCancellationTemplate,
  getVolunteerAssignmentTemplate,
  getCertificateReadyTemplate,
};
