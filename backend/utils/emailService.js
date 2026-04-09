const nodemailer = require('nodemailer');
const logger = require('./logger');

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_PORT === '465',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

const sendWelcomeEmail = async (user) => {
  if (!process.env.EMAIL_USER) {
    logger.warn('Email service not configured, skipping welcome email');
    return;
  }
  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: `"MusicStream" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Welcome to MusicStream!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f0f1a; color: #fff; padding: 40px; border-radius: 12px;">
          <h1 style="color: #00d9ff; text-align: center;">Welcome to MusicStream!</h1>
          <p>Hi ${user.username},</p>
          <p>Thanks for joining MusicStream. Start exploring millions of songs, create playlists, and discover new artists!</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}" style="background: linear-gradient(135deg, #7c3aed, #00d9ff); color: #fff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold;">
              Start Listening
            </a>
          </div>
          <p style="color: #888; font-size: 12px; text-align: center;">© 2024 MusicStream. All rights reserved.</p>
        </div>
      `,
    });
    logger.info(`Welcome email sent to ${user.email}`);
  } catch (error) {
    logger.error(`Failed to send welcome email: ${error.message}`);
  }
};

const sendPasswordResetEmail = async (user, resetToken) => {
  if (!process.env.EMAIL_USER) return;
  try {
    const transporter = createTransporter();
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    await transporter.sendMail({
      from: `"MusicStream" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f0f1a; color: #fff; padding: 40px; border-radius: 12px;">
          <h1 style="color: #00d9ff;">Password Reset</h1>
          <p>Hi ${user.username},</p>
          <p>You requested a password reset. Click the button below to reset your password. This link expires in 1 hour.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background: linear-gradient(135deg, #7c3aed, #00d9ff); color: #fff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold;">
              Reset Password
            </a>
          </div>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      `,
    });
    logger.info(`Password reset email sent to ${user.email}`);
  } catch (error) {
    logger.error(`Failed to send password reset email: ${error.message}`);
  }
};

module.exports = { sendWelcomeEmail, sendPasswordResetEmail };
