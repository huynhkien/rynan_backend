const nodemailer = require("nodemailer");
const asyncHandler = require('express-async-handler');

// Hàm validate email
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Hàm clean và normalize email
const normalizeEmail = (email) => {
  if (!email) return null;
  
  // Remove whitespace và convert to lowercase
  const cleaned = email.trim().toLowerCase();
  
  // Kiểm tra format cơ bản
  if (!isValidEmail(cleaned)) {
    return null;
  }
  
  return cleaned;
};

const sendMail = asyncHandler(async({email, html, subject}) => {
  // Validate và normalize email trước khi gửi
  const normalizedEmail = normalizeEmail(email);
  
  if (!normalizedEmail) {
    throw new Error(`Invalid email address: ${email}`);
  }
  
  console.log('Original email:', email);
  console.log('Normalized email:', normalizedEmail);
  
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, 
    auth: {
      user: process.env.EMAIL_NAME,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });

  const info = await transporter.sendMail({
    from: '"Rynan Smart Agriculture" <info@rynan.vn>', 
    to: normalizedEmail, // Sử dụng email đã được normalize
    subject: subject,
    html: html
  });
  
  console.log('Email sent successfully:', info.messageId);
  return info;
});

module.exports = sendMail;