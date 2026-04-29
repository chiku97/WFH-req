const nodemailer = require('nodemailer');

// Helper to handle Twilio webhook format (URL Encoded Form)
// Vercel usually parses application/x-www-form-urlencoded into req.body as an object
module.exports = async function handler(req, res) {
  // Only allow POST requests for webhooks
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Must be a POST request.' });
  }

  try {
    const { Body, From, To } = req.body;

    // We allow configuration of these numbers via Environment Variables
    // Using default numbers requested by user if env vars are missing
    // Webhook platforms like Twilio usually include country codes like 'whatsapp:+919708151418'
    const expectedSender = process.env.WHATSAPP_SENDER || 'whatsapp:+919708151418';
    const expectedReceiver = process.env.WHATSAPP_RECEIVER || 'whatsapp:+918147747120';

    console.log(`Received message from ${From} to ${To} with body: ${Body}`);

    // Validate the sender and receiver numbers
    if (From !== expectedSender || To !== expectedReceiver) {
      console.log('Sender or receiver did not match expected values. Ignoring.');
      // Return 200 so Twilio doesn't consider it a failed webhook delivery
      return res.status(200).send('<Response></Response>');
    }

    // Check if message content is exactly 'WFH' (case insensitive)
    if (!Body || Body.trim().toLowerCase() !== 'wfh') {
      console.log('Message is not WFH. Ignoring.');
      return res.status(200).send('<Response></Response>');
    }

    console.log('Valid WFH message received. Triggering email...');

    // Set up Nodemailer transport using Environment Variables
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS, // App password if using Gmail
      },
    });

    const targetEmail = process.env.TARGET_EMAIL;
    if (!targetEmail) {
      console.error('TARGET_EMAIL is not configured in Environment Variables.');
      return res.status(500).json({ error: 'Email configuration missing.' });
    }

    const mailOptions = {
      from: process.env.SENDER_EMAIL || process.env.SMTP_USER,
      to: targetEmail,
      subject: 'Work From Home Request',
      text: 'Hi Team,\n\nI will be working from home today.\n\nThanks,',
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    console.log('WFH Email sent successfully.');

    // Respond back to Twilio acknowledging the message
    const twimlResponse = `
      <Response>
        <Message>WFH email has been triggered successfully!</Message>
      </Response>
    `;
    
    // Set headers for XML response which Twilio expects
    res.setHeader('Content-Type', 'text/xml');
    return res.status(200).send(twimlResponse.trim());

  } catch (error) {
    console.error('Failed to process webhook:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
