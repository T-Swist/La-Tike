import nodemailer from 'nodemailer';
import logger from '../config/logger';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  attachments?: any[];
}

const emailConfigured = () =>
  !!process.env.EMAIL_HOST &&
  !!process.env.EMAIL_USER &&
  !/your[-_]/i.test(`${process.env.EMAIL_USER}${process.env.EMAIL_PASSWORD}`);

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  if (!emailConfigured()) {
    logger.info(`Email not configured, skipping "${options.subject}" to ${options.to}`);
    return;
  }
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'noreply@latike.com',
      to: options.to,
      subject: options.subject,
      html: options.html,
      attachments: options.attachments,
    });
    logger.info(`Email sent to ${options.to}`);
  } catch (error) {
    logger.error('Email sending failed:', error);
    throw new Error('Failed to send email');
  }
};

export const sendTicketEmail = async (
  email: string,
  eventTitle: string,
  tickets: Array<{ qrCode: string; ticketType: string }>
): Promise<void> => {
  const html = `
    <h1>Your Tickets for ${eventTitle}</h1>
    <p>Thank you for your purchase! Here are your tickets:</p>
    ${tickets.map((ticket, index) => `
      <div style="margin: 20px 0; padding: 20px; border: 1px solid #ddd;">
        <h3>Ticket ${index + 1}: ${ticket.ticketType}</h3>
        <img src="${ticket.qrCode}" alt="QR Code" style="width: 200px; height: 200px;" />
        <p>Show this QR code at the event entrance.</p>
      </div>
    `).join('')}
    <p>See you at the event!</p>
  `;

  await sendEmail({
    to: email,
    subject: `Your Tickets for ${eventTitle}`,
    html,
  });
};
