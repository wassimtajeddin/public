const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

app.post('/api/contact', (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ msg: 'Please fill in all fields' });
  }

  const adminHtml = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    </div>
  `;

  const userHtml = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2>Thank you for contacting us, ${name}!</h2>
      <p>We have received your message and will get back to you shortly.</p>
      <p>Here is a copy of your message:</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
      <br>
      <p>Best regards,</p>
      <p>Wassim Tajeddin</p>
    </div>
  `;

  const adminMailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: subject || 'New Contact Form Submission',
    html: adminHtml
  };

  const userMailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Thank you for contacting us',
    html: userHtml
  };

  transporter.sendMail(adminMailOptions, (error, info) => {
    if (error) {
      console.error('Error sending admin email:', error);
      return res.status(500).json({ msg: 'Error sending email' });
    }
    console.log('Admin email sent:', info.response);

    transporter.sendMail(userMailOptions, (error, info) => {
      if (error) {
        console.error('Error sending user email:', error);
        return res.status(500).json({ msg: 'Error sending email' });
      }
      console.log('User email sent:', info.response);
      res.status(200).json({ msg: 'Message sent successfully' });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});