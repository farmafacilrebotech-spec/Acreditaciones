import { z } from 'zod';

const memberSchema = z.object({
  nombre: z.string().trim().min(1, 'nombre is required'),
  generar: z.boolean(),
});

export const generatePdfSchema = z.object({
  members: z.array(memberSchema),
  logoId: z.string().trim().min(1).optional(),
  logoDataUrl: z.string().trim().min(1).optional(),
  backgroundId: z.string().trim().min(1).optional(),
  backgroundDataUrl: z.string().trim().min(1).optional(),
  titleText: z.string().trim().min(1).default('VIP FALLAS 2026'),
  footerText: z.string().trim().min(1).default('FALLA ALEMANIA - EL BACHILLER'),
}).refine((data) => data.logoId || data.logoDataUrl, {
  message: 'logoId or logoDataUrl is required',
  path: ['logoId'],
});

export const generateOneSchema = z.object({
  nombre: z.string().trim().min(1, 'nombre is required'),
  logoId: z.string().trim().min(1).optional(),
  logoDataUrl: z.string().trim().min(1).optional(),
  backgroundId: z.string().trim().min(1).optional(),
  backgroundDataUrl: z.string().trim().min(1).optional(),
  titleText: z.string().trim().min(1).default('VIP FALLAS 2026'),
  footerText: z.string().trim().min(1).default('FALLA ALEMANIA - EL BACHILLER'),
}).refine((data) => data.logoId || data.logoDataUrl, {
  message: 'logoId or logoDataUrl is required',
  path: ['logoId'],
});

