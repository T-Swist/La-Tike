import QRCode from 'qrcode';
import crypto from 'crypto';
import env from '../config/env';

// QR payload format: LT1.<ticketId>.<signature>
// "." is used as the separator because ticket ids are UUIDs, which contain "-".
const PREFIX = 'LT1';

export const generateQRHash = (ticketId: string): string => {
  return crypto.createHmac('sha256', env.QR_SECRET_KEY).update(ticketId).digest('hex');
};

export const generateQRCodeData = (ticketId: string): string => {
  return `${PREFIX}.${ticketId}.${generateQRHash(ticketId)}`;
};

export const verifyQRCode = (qrData: string): { ticketId: string; isValid: boolean } => {
  const parts = qrData.trim().split('.');

  if (parts.length !== 3 || parts[0] !== PREFIX) {
    return { ticketId: '', isValid: false };
  }

  const [, ticketId, hash] = parts;
  const expected = Buffer.from(generateQRHash(ticketId), 'hex');
  const actual = Buffer.from(hash, 'hex');

  return {
    ticketId,
    isValid: actual.length === expected.length && crypto.timingSafeEqual(actual, expected),
  };
};

export const generateQRCodeImage = async (data: string): Promise<string> => {
  try {
    return await QRCode.toDataURL(data, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      width: 300,
      margin: 1,
    });
  } catch (error) {
    throw new Error('Failed to generate QR code');
  }
};
