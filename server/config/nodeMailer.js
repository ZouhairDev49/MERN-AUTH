import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'sandbox.smtp.mailtrap.io', // Replace with your SMTP server
  port: 2525,
  auth: {
    user: process.env.SMTP_USER, // Replace with your SMTP user
    pass: process.env.SMTP_PASSWORD
  }
});

export default transporter;
