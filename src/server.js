import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import excelRoutes from './routes/excel.js';
import logoRoutes from './routes/logo.js';
import pdfRoutes from './routes/pdf.js';
import backgroundRoutes from './routes/background.js';

dotenv.config();

const app = express();

const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';
app.use(cors({ origin: corsOrigin }));
app.use(express.json({ limit: '2mb' }));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api', excelRoutes);
app.use('/api', logoRoutes);
app.use('/api', backgroundRoutes);
app.use('/api', pdfRoutes);

app.use((err, req, res, next) => {
  if (err?.name === 'ZodError') {
    return res.status(400).json({ error: 'Validation error', details: err.errors });
  }
  if (err?.name === 'MulterError') {
    return res.status(400).json({ error: err.message });
  }
  const message = err?.message || 'Unexpected error';
  const status =
    message.includes('required') ||
    message.includes('Missing') ||
    message.includes('Invalid') ||
    message.includes('not found') ||
    message.includes('expired') ||
    message.includes('No members') ||
    message.includes('Only') ||
    message.includes('Excel')
      ? 400
      : 500;
  return res.status(status).json({ error: message });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});

