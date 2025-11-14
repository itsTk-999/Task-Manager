const nodemailer = require('nodemailer');

const sendEmail = (to, subject, html) => {
  // Check for Brevo key instead of SendGrid
  if (process.env.NODE_ENV === 'development' && !process.env.BREVO_SMTP_KEY) {
    console.log('---------------------------------');
    console.log('NO BREVO_SMTP_KEY found.');
    console.log('Simulating email instead:');
    console.log(`TO: ${to}`);
    console.log(`SUBJECT: ${subject}`);
    // This logs the clickable link to your terminal for testing
    console.log('HTML (link):', html.match(/href="([^"]*)"/)[1]);
    console.log('---------------------------------');
    return Promise.resolve();
  }

  // --- THIS IS THE NEW TRANSPORT CONFIG ---
  // We use Nodemailer's built-in SMTP transport
  const transporter = nodemailer.createTransport({
    host: process.env.BREVO_SMTP_HOST,
    port: process.env.BREVO_SMTP_PORT,
    auth: {
      user: process.env.BREVO_SMTP_USER, // Your Brevo email
      pass: process.env.BREVO_SMTP_KEY,   // Your Brevo SMTP key
    },
    tls: {
      rejectUnauthorized: false
    }
  });
  // --- END NEW CONFIG ---

  const mailOptions = {
    from: 'liltk0998@gmail.com', // IMPORTANT: Brevo may require you to verify this email address
    to: to,
    subject: subject,
    html: html,
    headers: {
      'X-Mailin-Track': 'false'
    }
  };

  return transporter.sendMail(mailOptions);
};

module.exports = sendEmail;