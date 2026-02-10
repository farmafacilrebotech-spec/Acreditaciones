import { Router } from 'express';
import { generateCardsPdf } from '../services/pdfGenerator.js';
import { getLogo } from '../services/logoStore.js';
import { getBackground } from '../services/backgroundStore.js';
import { generateOneSchema, generatePdfSchema } from '../utils/validate.js';

const router = Router();

const parseImageBuffer = (body, options) => {
  const { idKey, dataUrlKey, notFoundMessage, invalidMessage } = options;
  if (body[idKey]) {
    const stored = idKey === 'logoId' ? getLogo(body[idKey]) : getBackground(body[idKey]);
    if (!stored) {
      throw new Error(notFoundMessage);
    }
    return stored.buffer;
  }

  if (body[dataUrlKey]) {
    const match = body[dataUrlKey].match(/^data:(image\/\w+);base64,(.+)$/);
    if (!match) {
      throw new Error(invalidMessage);
    }
    return Buffer.from(match[2], 'base64');
  }

  return null;
};

router.post('/generate-pdf', async (req, res, next) => {
  try {
    const parsed = generatePdfSchema.parse(req.body);
    const eligible = parsed.members.filter((member) => member.generar);
    if (!eligible.length) {
      return res.status(400).json({ error: 'No members marked with generar=SI.' });
    }

    const logoBuffer = parseImageBuffer(parsed, {
      idKey: 'logoId',
      dataUrlKey: 'logoDataUrl',
      notFoundMessage: 'Logo not found or expired.',
      invalidMessage: 'Invalid logoDataUrl format.',
    });
    const backgroundBuffer = parseImageBuffer(parsed, {
      idKey: 'backgroundId',
      dataUrlKey: 'backgroundDataUrl',
      notFoundMessage: 'Background not found or expired.',
      invalidMessage: 'Invalid backgroundDataUrl format.',
    });
    const doc = await generateCardsPdf({
      members: eligible,
      titleText: parsed.titleText,
      footerText: parsed.footerText,
      logoBuffer,
      backgroundBuffer,
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="vip-cards.pdf"');
    doc.pipe(res);
    doc.end();
  } catch (error) {
    next(error);
  }
});

router.post('/generate-one', async (req, res, next) => {
  try {
    const parsed = generateOneSchema.parse(req.body);
    const logoBuffer = parseImageBuffer(parsed, {
      idKey: 'logoId',
      dataUrlKey: 'logoDataUrl',
      notFoundMessage: 'Logo not found or expired.',
      invalidMessage: 'Invalid logoDataUrl format.',
    });
    const backgroundBuffer = parseImageBuffer(parsed, {
      idKey: 'backgroundId',
      dataUrlKey: 'backgroundDataUrl',
      notFoundMessage: 'Background not found or expired.',
      invalidMessage: 'Invalid backgroundDataUrl format.',
    });
    const doc = await generateCardsPdf({
      members: [{ nombre: parsed.nombre, generar: true }],
      titleText: parsed.titleText,
      footerText: parsed.footerText,
      logoBuffer,
      backgroundBuffer,
      single: true,
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="vip-card.pdf"');
    doc.pipe(res);
    doc.end();
  } catch (error) {
    next(error);
  }
});

export default router;

