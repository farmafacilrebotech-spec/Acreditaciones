import { Router } from 'express';
import multer from 'multer';
import { parseExcelBuffer } from '../services/excelParser.js';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

router.post('/parse-excel', upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Excel file is required.' });
    }
    const parsed = parseExcelBuffer(req.file.buffer);
    return res.json(parsed);
  } catch (error) {
    return next(error);
  }
});

export default router;

