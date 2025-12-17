import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html?: string;
  text?: string;
  from?: string; // Optional, defaults to SMTP_FROM_EMAIL
  fromName?: string; // Optional, defaults to SMTP_FROM_NAME
}

let transporter: nodemailer.Transporter | undefined;

function initializeTransporter() {
  if (transporter) return; // Already initialized

  let transportConfig: any;

  if (process.env.SMTP_HOST) {
    transportConfig = {
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false // This can be removed in production if using valid SSL certs
      }
    };
  } else if (process.env.SMTP_SERVICE) {
    transportConfig = {
      service: process.env.SMTP_SERVICE,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    };
  } else {
    console.warn('Email transport not configured. Neither SMTP_HOST nor SMTP_SERVICE found in environment variables.');
    return;
  }
  
  transporter = nodemailer.createTransport(transportConfig);
  console.log('Email transporter initialized.');
}

export async function sendEmail(options: EmailOptions) {
  initializeTransporter();

  if (!transporter) {
    console.error('Email transporter is not initialized. Cannot send email.');
    return;
  }

  const fromEmail = options.from || process.env.SMTP_FROM_EMAIL;
  const fromName = options.fromName || process.env.SMTP_FROM_NAME || 'Mystic Fortune';

  if (!fromEmail) {
    console.error('SMTP_FROM_EMAIL is not configured. Cannot send email.');
    return;
  }

  const mailOptions = {
    from: `"${fromName}" <${fromEmail}>`,
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

// Optional: Test function to verify setup
export async function testEmailConfig() {
  if (process.env.NODE_ENV === 'development' && process.env.SMTP_HOST && process.env.SMTP_USER) {
    console.log('Attempting to send a test email...');
    try {
      await sendEmail({
        to: process.env.SMTP_USER, // Send to self for testing
        subject: 'Test Email from Mystic Fortune',
        text: 'This is a test email sent from your Mystic Fortune application.',
        html: '<p>This is a <b>test email</b> sent from your Mystic Fortune application.</p>',
      });
      console.log('Test email sent successfully to ' + process.env.SMTP_USER);
    } catch (error) {
      console.error('Failed to send test email:', error);
    }
  }
}

// Call test email config on startup if in development
if (process.env.NODE_ENV === 'development') {
  testEmailConfig();
}
