import QRCode from 'qrcode';
import crypto from 'crypto';

export const generateQRHash = (ticketId: string, eventId: string): string => {
  const secret = process.env.QR_SECRET_KEY || 'default-secret';
  const data = `${ticketId}-${eventId}`;
  return crypto.createHmac('sha256', secret).update(data).digest('hex');
};

export const generateQRCodeData = (ticketId: string, eventId: string): string => {
  const hash = generateQRHash(ticketId, eventId);
  return `${ticketId}-${eventId}-${hash}`;
};

export const verifyQRCode = (qrData: string): { ticketId: string; eventId: string; isValid: boolean } => {
  const parts = qrData.split('-');
  
  if (parts.length !== 3) {
    return { ticketId: '', eventId: '', isValid: false };
  }

  const [ticketId, eventId, hash] = parts;
  const expectedHash = generateQRHash(ticketId, eventId);
  
  return {
    ticketId,
    eventId,
    isValid: hash === expectedHash,
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
