const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

// Configure Nodemailer transporter (replace with your email settings)
const transporter = nodemailer.createTransport({  // Fixed: createTransport (not createTransporter)
  service: 'gmail', // Or your email provider
  auth: {
    user: 'your-email@gmail.com', // Replace with your email
    pass: 'your-app-password' // Use an app password for Gmail (not your regular password)
  }
});

// GET /contact - Render contact page
router.get('/', (req, res) => {
  res.render('contact', { message: req.query.message }); // Pass success/error message
});

// POST /contact - Handle form submission and send email
router.post('/', async (req, res) => {
  const { name, email, subject, message } = req.body;

  // Validate inputs (basic check)
  if (!name || !email || !subject || !message) {
    return res.redirect('/contact?message=All fields are required.');
  }

  // Email options
  const mailOptions = {
    from: email, // Sender's email
    to: 'support@pharmadesk.com', // Company's email
    subject: `Contact Form: ${subject}`,
    text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    html: `<p><strong>Name:</strong> ${name}</p>
           <p><strong>Email:</strong> ${email}</p>
           <p><strong>Subject:</strong> ${subject}</p>
           <p><strong>Message:</strong></p>
           <p>${message.replace(/\n/g, '<br>')}</p>`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.redirect('/contact?message=Thank you! Your message has been sent.');
  } catch (error) {
    console.error('Error sending email:', error);
    res.redirect('/contact?message=Sorry, there was an error sending your message. Please try again.');
  }
});

module.exports = router;