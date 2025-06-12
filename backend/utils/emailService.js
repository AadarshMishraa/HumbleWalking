import nodemailer from 'nodemailer';
import ejs from 'ejs';
import fs from 'fs';
import path from 'path';

// Create reusable transporter object
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Email template directory
const templateDir = path.join(process.cwd(), 'email-templates');

export const sendEmail = async (options) => {
  try {
    // Render HTML template
    const templatePath = path.join(templateDir, `${options.template}.ejs`);
    const html = await ejs.renderFile(templatePath, options.context);
    
    const mailOptions = {
      from: `"HumbleWalking Consultancy" <${process.env.EMAIL_FROM}>`,
      to: options.recipient,
      subject: options.subject,
      html,
      attachments: options.attachments || [],
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email send error:', error);
    throw new Error('Failed to send email');
  }
};

