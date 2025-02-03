// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Expo } = require('expo-server-sdk');
const twilio = require('twilio');
const dotenv = require('dotenv');

// Load .env variables
dotenv.config();

const app = express();
const port = 5000;

// Twilio configuration
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = twilio(accountSid, authToken);
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Example route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Route to send SMS using Twilio
app.post('/send-sms', async (req, res) => {
  try {
    const { to, message } = req.body;

    if (!to || !message) {
      res.status(400).json({ error: 'Missing required fields: to, message' });
      return;
    }

    const response = await twilioClient.messages.create({
      from: twilioPhoneNumber,
      to: to,
      body: message,
    });

    res.json({ success: true, sid: response.sid });
  } catch (error) {
    console.error('Twilio Error:', error);
    res.status(500).json({ success: false });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
