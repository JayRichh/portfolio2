import { Router, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';

const router = Router();

const limiter = rateLimit({
  windowMs: 60000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
});

const RECIPIENT_EMAIL = 'web@jayrich.dev';

router.post('/', limiter, async (req: Request, res: Response) => {
  const { name, email, message, drawing } = req.body;

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const htmlBody = `
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Message:</strong></p>
    <p>${message}</p>
    ${drawing ? '<p>Drawing attached below</p>' : ''}
  `;

  const emailData: any = {
    api_key: process.env.SMTP_API_KEY,
    to: [RECIPIENT_EMAIL],
    sender: RECIPIENT_EMAIL,
    subject: `New Contact Form Submission from ${name}`,
    html_body: htmlBody,
    custom_headers: [
      { header: 'Reply-To', value: email }
    ]
  };

  if (drawing) {
    emailData.attachments = [
      {
        filename: 'drawing.png',
        fileblob: drawing,
        mimetype: 'image/png'
      }
    ];
  }

  try {
    const response = await fetch('https://api.smtp2go.com/v3/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(emailData)
    });

    if (!response.ok) {
      throw new Error('Failed to send email');
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Email send error:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

export default router;
