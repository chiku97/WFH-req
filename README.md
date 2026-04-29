# WFH WhatsApp Automation

This project is a serverless application designed to be deployed on Vercel. It listens for a WhatsApp message containing "WFH" and triggers an automated email.

## Setup Instructions

### 1. Deploy to Vercel
1. Push this repository to GitHub.
2. Log into [Vercel](https://vercel.com) and click "Add New..." -> "Project".
3. Import your GitHub repository.
4. Before deploying, set the following **Environment Variables** in Vercel:

| Variable Name | Description | Example |
|---|---|---|
| `SMTP_HOST` | Your email provider's SMTP host | `smtp.gmail.com` |
| `SMTP_PORT` | Your email provider's SMTP port | `465` |
| `SMTP_USER` | Your email address used for login | `your-email@gmail.com` |
| `SMTP_PASS` | Your email password or app password | `your-app-password` |
| `SENDER_EMAIL` | The email address to send from (optional, defaults to SMTP_USER) | `your-email@gmail.com` |
| `TARGET_EMAIL` | The email address to send the WFH request TO | `hr@yourcompany.com` |
| `WHATSAPP_SENDER` | The expected sender WhatsApp number (must include `whatsapp:` and country code) | `whatsapp:+919708151418` |
| `WHATSAPP_RECEIVER` | The expected receiver WhatsApp number (your Twilio number) | `whatsapp:+918147747120` |

### 2. Set up WhatsApp Webhook (Twilio)
1. Log into your [Twilio Console](https://www.twilio.com/console).
2. Navigate to **Messaging** -> **Try it out** -> **Send a WhatsApp message** (if using Sandbox) or your configured WhatsApp Sender.
3. In the Sandbox settings (or Sender settings), find the section for "When a message comes in".
4. Enter your Vercel deployment URL followed by the webhook path:
   `https://<your-vercel-project>.vercel.app/api/whatsapp`
5. Ensure the HTTP method is set to **POST**.

### 3. Usage
Simply send a WhatsApp message with the exact text `WFH` to your Twilio WhatsApp number from your authorized sender number. The project will intercept this webhook, validate the numbers, and dispatch the "Work From Home" email.
