import { jsPDF, GState } from 'jspdf';
import QRCode from 'qrcode';

export type VipMember = {
  id: string;
  nombre: string;
  generar: boolean;
  foto?: string;
};

const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;
const CARD_WIDTH = 54;
const CARD_HEIGHT = 85;
const GRID_COLS = 3;
const GRID_ROWS = 3;
const GAP = 6;
const GOLD = '#D4AF37';

const loadImage = (dataUrl: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('No se pudo cargar el logo.'));
    img.src = dataUrl;
  });

const loadDataUrlFromPublic = async (path: string) => {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`No se pudo cargar el fondo (${path}).`);
  }
  const blob = await response.blob();
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('No se pudo leer el fondo.'));
    reader.readAsDataURL(blob);
  });
};

const getImageFormat = (dataUrl: string) => {
  if (dataUrl.startsWith('data:image/jpeg') || dataUrl.startsWith('data:image/jpg')) {
    return 'JPEG';
  }
  if (dataUrl.startsWith('data:image/png')) {
    return 'PNG';
  }
  return 'PNG';
};

const fitRect = (width: number, height: number, maxWidth: number, maxHeight: number) => {
  const ratio = Math.min(maxWidth / width, maxHeight / height);
  return { width: width * ratio, height: height * ratio };
};

export const generateVipCardsPdf = async (
  members: VipMember[],
  logoDataUrl: string
): Promise<void> => {
  if (!logoDataUrl) {
    throw new Error('El logo es obligatorio.');
  }

  const backgroundDataUrl = await loadDataUrlFromPublic('/fondo.png');
  if (!backgroundDataUrl) {
    throw new Error('El fondo es obligatorio.');
  }

  const eligible = members.filter((member) => member.generar && member.nombre.trim().length > 0);
  if (eligible.length === 0) {
    throw new Error('No hay miembros con generar=true.');
  }
  const baseUrl = import.meta.env.VITE_PUBLIC_URL || window.location.origin;

  const backgroundImage = await loadImage(backgroundDataUrl);
  if (!backgroundImage.width || !backgroundImage.height) {
    throw new Error('El fondo no se pudo cargar correctamente.');
  }
  const logoImage = await loadImage(logoDataUrl);
  const logoMaxWidth = CARD_WIDTH * 0.5;
  const logoMaxHeight = 18;
  const logoSize = fitRect(logoImage.width, logoImage.height, logoMaxWidth, logoMaxHeight);
  const backgroundFormat = getImageFormat(backgroundDataUrl);
  const logoFormat = getImageFormat(logoDataUrl);

  const totalWidth = GRID_COLS * CARD_WIDTH + (GRID_COLS - 1) * GAP;
  const totalHeight = GRID_ROWS * CARD_HEIGHT + (GRID_ROWS - 1) * GAP;
  const startX = (PAGE_WIDTH - totalWidth) / 2;
  const startY = (PAGE_HEIGHT - totalHeight) / 2;
  const perPage = GRID_COLS * GRID_ROWS;

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  doc.setFont('helvetica', 'bold');

  for (let index = 0; index < eligible.length; index += 1) {
    if (index > 0 && index % perPage === 0) {
      doc.addPage('a4', 'portrait');
    }

    const pageIndex = index % perPage;
    const col = pageIndex % GRID_COLS;
    const row = Math.floor(pageIndex / GRID_COLS);
    const x = startX + col * (CARD_WIDTH + GAP);
    const y = startY + row * (CARD_HEIGHT + GAP);

    // Fondo de la tarjeta
    doc.addImage(backgroundDataUrl, backgroundFormat, x, y, CARD_WIDTH, CARD_HEIGHT);
    // Difuminar el fondo con una capa semitransparente
    doc.setGState(new GState({ opacity: 0.35 }));
    doc.setFillColor(0, 0, 0);
    doc.rect(x, y, CARD_WIDTH, CARD_HEIGHT, 'F');
    doc.setGState(new GState({ opacity: 1 }));
    // Marco dorado
    doc.setDrawColor(GOLD);
    doc.setLineWidth(0.6);
    doc.rect(x, y, CARD_WIDTH, CARD_HEIGHT, 'S');

    const logoX = x + (CARD_WIDTH - logoSize.width) / 2;
    const logoY = y + 5;
    doc.addImage(logoDataUrl, logoFormat, logoX, logoY, logoSize.width, logoSize.height);

    doc.setTextColor(GOLD);
    doc.setFontSize(10);
    doc.text('VIP FALLAS 2026', x + CARD_WIDTH / 2, logoY + logoSize.height + 8, {
      align: 'center',
    });
    doc.setDrawColor(GOLD);
    doc.setLineWidth(0.2);
    doc.line(x + 6, logoY + logoSize.height + 11, x + CARD_WIDTH - 6, logoY + logoSize.height + 11);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.text(eligible[index].nombre.toUpperCase(), x + CARD_WIDTH / 2, y + CARD_HEIGHT * 0.48, {
      align: 'center',
    });

    const qrSize = 18;
    const qrX = x + (CARD_WIDTH - qrSize) / 2;
    const qrY = y + CARD_HEIGHT - qrSize - 16;
    const qrDataUrl = await QRCode.toDataURL(`${baseUrl}/qr/${eligible[index].id}`, {
      errorCorrectionLevel: 'M',
      margin: 1,
      width: 256,
    });

    doc.setFillColor(255, 255, 255);
    doc.rect(qrX, qrY, qrSize, qrSize, 'F');
    doc.setDrawColor(GOLD);
    doc.setLineWidth(0.4);
    doc.rect(qrX, qrY, qrSize, qrSize, 'S');
    doc.addImage(qrDataUrl, 'PNG', qrX + 1.5, qrY + 1.5, qrSize - 3, qrSize - 3);

    doc.setTextColor(GOLD);
    doc.setFontSize(7);
    doc.text('FALLA ALEMANIA', x + CARD_WIDTH / 2, y + CARD_HEIGHT - 8, {
      align: 'center',
    });
    doc.text('EL BACHILLER', x + CARD_WIDTH / 2, y + CARD_HEIGHT - 4.5, {
      align: 'center',
    });
  }

  doc.save('carnets-vip-fallas-2026.pdf');
};

