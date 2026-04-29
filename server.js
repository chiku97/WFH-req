const express = require('express');
const app = express();
const whatsappHandler = require('./api/whatsapp.js');

// Load environment variables from .env
require('dotenv').config();

// Parse URL-encoded bodies (as sent by Twilio)
app.use(express.urlencoded({ extended: true }));
// Parse JSON bodies (just in case)
app.use(express.json());

// Route all POST requests to /api/whatsapp to our handler
app.post('/api/whatsapp', (req, res) => {
    // Vercel serverless functions normally take (req, res), which Express perfectly matches!
    whatsappHandler(req, res);
});

// A simple GET route so you can test if the server is running in your browser
app.get('/', (req, res) => {
    res.send(`
        <h1>Local Dev Server is Running!</h1>
        <p>Your WhatsApp webhook is listening on <strong>POST /api/whatsapp</strong>.</p>
        <p>To test it, send a POST request with Twilio-like data to <code>http://localhost:3000/api/whatsapp</code> using Postman or cURL.</p>
    `);
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`\n=========================================`);
    console.log(`Local development server is running!`);
    console.log(`Listening on: http://localhost:${PORT}`);
    console.log(`=========================================\n`);
});
