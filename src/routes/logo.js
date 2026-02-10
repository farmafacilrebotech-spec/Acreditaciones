import { Router } from 'express';
import multer from 'multer';
import sharp from 'sharp';
import { saveLogo } from '../services/logoStore.js';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const isImage = ['image/png', 'image/jpeg', 'image/jpg'].includes(file.mimetype);
    cb(isImage ? null : new Error('Only PNG or JPG files are allowed.'), isImage);
  },
});

router.post('/upload-logo', upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Logo file is required.' });
    }
    const processed = await sharp(req.file.buffer).png().toBuffer();
    const logoId = saveLogo(processed, 'image/png');
    return res.json({ logoId });
  } catch (error) {
    return next(error);
  }
});

export default router;

