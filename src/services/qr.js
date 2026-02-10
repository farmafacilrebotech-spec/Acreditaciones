import QRCode from 'qrcode';

export const generateQrPng = async (text, sizePx) => {
  return QRCode.toBuffer(text, {
    type: 'png',
    width: sizePx,
    margin: 1,
    errorCorrectionLevel: 'M',
  });
};

