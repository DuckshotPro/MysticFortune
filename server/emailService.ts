import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

interface EmailOptions {
    to: string | string[];
    subject: string;
    html: string;
    text?: string;
    attachments?: any[];
}

interface EmailConfig {
    host: string;
    port: number;
    secure: boolean;
    auth: {
        user: string;
        pass: string;
    };
}

/**
 * Self-Hosted Email Service
 * 
 * Supports:
 * - SMTP (standard email servers)
 * - Postal (self-hosted email platform)
 * - Mailu (self-hosted email server)
 * - Any SMTP-compatible service
 * 
 * Configuration via environment variables:
 * - SMTP_HOST
 * - SMTP_PORT
 * - SMTP_USER
 * - SMTP_PASSWORD
 * - SMTP_FROM_EMAIL
 * - SMTP_FROM_NAME
 */
class EmailService {
    private transporter: Transporter | null = null;
    private fromAddress: string;
    private fromName: string;

    constructor() {
        this.fromAddress = process.env.SMTP_FROM_EMAIL || 'noreply@mysticfortune.com';
        this.fromName = process.env.SMTP_FROM_NAME || 'Mystic Fortune';

        this.initializeTransporter();
    }

    private initializeTransporter() {
        const host = process.env.SMTP_HOST;
        const port = parseInt(process.env.SMTP_PORT || '587');
        const user = process.env.SMTP_USER;
        const pass = process.env.SMTP_PASSWORD;

        if (!host || !user || !pass) {
            console.warn('⚠️  Email service not configured. Set SMTP_* environment variables to enable email sending.');
            return;
        }

        try {
            this.transporter = nodemailer.createTransporter({
                host,
                port,
                secure: port === 465, // true for 465, false for other ports
                auth: {
                    user,
                    pass,
                },
                // Optional: Add DKIM signing if configured
                dkim: process.env.DKIM_PRIVATE_KEY ? {
                    domainName: process.env.DKIM_DOMAIN || 'mysticfortune.com',
                    keySelector: process.env.DKIM_SELECTOR || 'default',
                    privateKey: process.env.DKIM_PRIVATE_KEY,
                } : undefined,
            });

            console.log('✅ Email service initialized successfully');
        } catch (error) {
            console.error('❌ Failed to initialize email service:', error);
        }
    }

    /**
     * Send an email
     */
    async sendEmail(options: EmailOptions): Promise<boolean> {
        if (!this.transporter) {
            console.error('Email service not configured. Cannot send email.');
            return false;
        }

        try {
            const mailOptions = {
                from: `"${this.fromName}" <${this.fromAddress}>`,
                to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
                subject: options.subject,
                html: options.html,
                text: options.text || this.stripHtml(options.html),
                attachments: options.attachments,
            };

            const info = await this.transporter.sendMail(mailOptions);
            console.log('📧 Email sent:', info.messageId);
            return true;
        } catch (error) {
            console.error('❌ Failed to send email:', error);
            return false;
        }
    }

    /**
     * Send welcome email to new users
     */
    async sendWelcomeEmail(to: string, username: string): Promise<boolean> {
        const html = this.getWelcomeTemplate(username);
        return this.sendEmail({
            to,
            subject: '🔮 Welcome to Mystic Fortune - Your Journey Begins!',
            html,
        });
    }

    /**
     * Send email verification
     */
    async sendVerificationEmail(to: string, verificationLink: string): Promise<boolean> {
        const html = this.getVerificationTemplate(verificationLink);
        return this.sendEmail({
            to,
            subject: '🔮 Verify Your Mystic Fortune Account',
            html,
        });
    }

    /**
     * Send fortune notification
     */
    async sendFortuneNotification(to: string, fortuneText: string, category: string): Promise<boolean> {
        const html = this.getFortuneTemplate(fortuneText, category);
        return this.sendEmail({
            to,
            subject: `🔮 Your ${category} Fortune Awaits!`,
            html,
        });
    }

    /**
     * Send marketing newsletter
     */
    async sendNewsletter(to: string | string[], subject: string, content: string): Promise<boolean> {
        const html = this.getNewsletterTemplate(content);
        return this.sendEmail({
            to,
            subject,
            html,
        });
    }

    /**
     * Send password reset email
     */
    async sendPasswordReset(to: string, resetLink: string): Promise<boolean> {
        const html = this.getPasswordResetTemplate(resetLink);
        return this.sendEmail({
            to,
            subject: '🔒 Reset Your Mystic Fortune Password',
            html,
        });
    }

    /**
     * Send bulk emails (with rate limit)
     */
    async sendBulkEmails(emails: { to: string; subject: string; html: string }[]): Promise<number> {
        let successCount = 0;
        const delay = 100; // 100ms delay between emails to avoid rate limits

        for (const email of emails) {
            const success = await this.sendEmail(email);
            if (success) successCount++;

            // Rate limiting
            await new Promise(resolve => setTimeout(resolve, delay));
        }

        return successCount;
    }

    /**
     * Verify SMTP connection
     */
    async verifyConnection(): Promise<boolean> {
        if (!this.transporter) {
            return false;
        }

        try {
            await this.transporter.verify();
            console.log('✅ SMTP connection verified');
            return true;
        } catch (error) {
            console.error('❌ SMTP verification failed:', error);
            return false;
        }
    }

    /**
     * Email Templates (inline for now, can be moved to separate files)
     */

    private getWelcomeTemplate(username: string): string {
        return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Arial', sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
    .content { padding: 30px; }
    .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    .footer { background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔮 Welcome to Mystic Fortune!</h1>
    </div>
    <div class="content">
      <p>Hello <strong>${username}</strong>,</p>
      <p>Welcome to your mystical journey! We're thrilled to have you join our community of seekers and believers.</p>
      <p>🌟 Here's what you can explore:</p>
      <ul>
        <li>✨ Personalized AI-powered fortune readings</li>
        <li>🃏 Daily tarot card interpretations</li>
        <li>♈ Comprehensive horoscopes for all zodiac signs</li>
        <li>🔮 Premium insights and advanced features</li>
      </ul>
      <p style="text-align: center;">
        <a href="${process.env.APP_URL || 'https://mysticfortune.com'}" class="button">Start Your Journey</a>
      </p>
      <p>May the stars guide your path,<br><strong>The Mystic Fortune Team</strong></p>
    </div>
    <div class="footer">
      <p>This email was sent to you because you created an account on Mystic Fortune.</p>
      <p>If you didn't create this account, please ignore this email.</p>
    </div>
  </div>
</body>
</html>
    `;
    }

    private getVerificationTemplate(verificationLink: string): string {
        return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Arial', sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
    .content { padding: 30px; }
    .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    .footer { background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔐 Verify Your Email</h1>
    </div>
    <div class="content">
      <p>Please verify your email address to activate your Mystic Fortune account.</p>
      <p style="text-align: center;">
        <a href="${verificationLink}" class="button">Verify Email Address</a>
      </p>
      <p style="color: #666; font-size: 12px;">Or copy and paste this link:<br><a href="${verificationLink}">${verificationLink}</a></p>
      <p>This link will expire in 24 hours for security reasons.</p>
    </div>
    <div class="footer">
      <p>If you didn't request this verification, please ignore this email.</p>
    </div>
  </div>
</body>
</html>
    `;
    }

    private getFortuneTemplate(fortuneText: string, category: string): string {
        return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Arial', sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
    .content { padding: 30px; }
    .fortune-box { background: #f9f9f9; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0; font-style: italic; }
    .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    .footer { background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔮 Your ${category} Fortune</h1>
    </div>
    <div class="content">
      <p>The stars have aligned to bring you this message:</p>
      <div class="fortune-box">
        ${fortuneText}
      </div>
      <p style="text-align: center;">
        <a href="${process.env.APP_URL || 'https://mysticfortune.com'}" class="button">Get More Fortunes</a>
      </p>
      <p>May this guidance light your way,<br><strong>Mystic Fortune</strong></p>
    </div>
    <div class="footer">
      <p>You're receiving this because you're subscribed to Mystic Fortune notifications.</p>
      <p><a href="${process.env.APP_URL}/settings">Manage your preferences</a></p>
    </div>
  </div>
</body>
</html>
    `;
    }

    private getNewsletterTemplate(content: string): string {
        return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Arial', sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
    .content { padding: 30px; }
    .footer { background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📧 Mystic Fortune Newsletter</h1>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p>Thanks for being part of the Mystic Fortune community!</p>
      <p><a href="${process.env.APP_URL}/unsubscribe">Unsubscribe</a></p>
    </div>
  </div>
</body>
</html>
    `;
    }

    private getPasswordResetTemplate(resetLink: string): string {
        return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Arial', sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
    .content { padding: 30px; }
    .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    .footer { background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔒 Password Reset Request</h1>
    </div>
    <div class="content">
      <p>You requested to reset your Mystic Fortune password.</p>
      <p style="text-align: center;">
        <a href="${resetLink}" class="button">Reset Password</a>
      </p>
      <p style="color: #666; font-size: 12px;">Or copy and paste this link:<br><a href="${resetLink}">${resetLink}</a></p>
      <p>This link will expire in 1 hour for security reasons.</p>
      <p><strong>If you didn't request this, please ignore this email and your password will remain unchanged.</strong></p>
    </div>
    <div class="footer">
      <p>For security reasons, never share this link with anyone.</p>
    </div>
  </div>
</body>
</html>
    `;
    }

    private stripHtml(html: string): string {
        return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    }
}

// Export singleton instance
export const emailService = new EmailService();
