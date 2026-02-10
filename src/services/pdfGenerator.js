import PDFDocument from 'pdfkit';
import sharp from 'sharp';
import { generateQrPng } from './qr.js';
import { CARD_MM, COLORS, GRID, PAGE_MM, mmToPt } from '../utils/constants.js';

const buildLogoBuffer = async (logoBuffer, maxWidthPt, maxHeightPt) => {
  if (!logoBuffer) return null;
  const maxWidthPx = Math.round(maxWidthPt);
  const maxHeightPx = Math.round(maxHeightPt);
  return sharp(logoBuffer)
    .resize({
      width: maxWidthPx,
      height: maxHeightPx,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .png()
    .toBuffer();
};

const buildBackgroundBuffer = async (backgroundBuffer, widthPt, heightPt) => {
  if (!backgroundBuffer) return null;
  const widthPx = Math.round(widthPt);
  const heightPx = Math.round(heightPt);
  return sharp(backgroundBuffer)
    .resize({
      width: widthPx,
      height: heightPx,
      fit: 'cover',
    })
    .png()
    .toBuffer();
};

const drawCard = async ({
  doc,
  x,
  y,
  width,
  height,
  name,
  titleText,
  footerText,
  logoBuffer,
  backgroundBuffer,
}) => {
  const borderWidth = 1;
  const paddingPt = mmToPt(4);

  doc.save();
  if (backgroundBuffer) {
    doc.image(backgroundBuffer, x, y, { width, height });
    doc.fillOpacity(0.6).rect(x, y, width, height).fill(COLORS.black);
    doc.fillOpacity(1);
  } else {
    doc.rect(x, y, width, height).fill(COLORS.black);
  }
  doc.lineWidth(borderWidth).rect(x, y, width, height).stroke(COLORS.gold);

  const logoSize = mmToPt(16);
  const logoX = x + paddingPt;
  const logoY = y + paddingPt;

  if (logoBuffer) {
    doc.image(logoBuffer, logoX, logoY, {
      fit: [logoSize, logoSize],
      align: 'center',
      valign: 'center',
    });
  }

  doc.fillColor(COLORS.gold);
  doc.fontSize(9);
  doc.text('VIP ADULTO FALLAS 2026', logoX + logoSize + mmToPt(2), logoY + mmToPt(2), {
    width: width - paddingPt * 2 - logoSize - mmToPt(2),
    align: 'left',
  });

  doc.fontSize(10);
  doc.text(titleText, x + paddingPt, logoY + logoSize + mmToPt(4), {
    width: width - paddingPt * 2,
    align: 'center',
  });

  doc.fontSize(12);
  doc.text(name.toUpperCase(), x + paddingPt, y + height * 0.45, {
    width: width - paddingPt * 2,
    align: 'center',
  });

  const qrBoxSize = mmToPt(14);
  const qrBoxX = x + (width - qrBoxSize) / 2;
  const qrBoxY = y + height - qrBoxSize - mmToPt(24);

  doc.fillColor(COLORS.white);
  doc.rect(qrBoxX, qrBoxY, qrBoxSize, qrBoxSize).fill();
  doc.lineWidth(borderWidth).rect(qrBoxX, qrBoxY, qrBoxSize, qrBoxSize).stroke(COLORS.gold);

  const qrBuffer = await generateQrPng(name, Math.max(256, Math.round(qrBoxSize * 4)));
  doc.image(qrBuffer, qrBoxX + 2, qrBoxY + 2, {
    fit: [qrBoxSize - 4, qrBoxSize - 4],
    align: 'center',
    valign: 'center',
  });

  doc.fillColor(COLORS.gold);
  doc.fontSize(7);
  doc.text(footerText, x + paddingPt, y + height - paddingPt - mmToPt(2), {
    width: width - paddingPt * 2,
    align: 'center',
    lineGap: 0,
  });

  doc.restore();
};

export const generateCardsPdf = async ({
  members,
  titleText,
  footerText,
  logoBuffer,
  backgroundBuffer,
  single = false,
}) => {
  const doc = new PDFDocument({ size: 'A4', margin: 0 });

  const cardWidthPt = mmToPt(CARD_MM.width);
  const cardHeightPt = mmToPt(CARD_MM.height);
  const pageWidthPt = mmToPt(PAGE_MM.width);
  const pageHeightPt = mmToPt(PAGE_MM.height);

  const preparedLogo = await buildLogoBuffer(
    logoBuffer,
    cardWidthPt * 0.7,
    mmToPt(18),
  );
  const preparedBackground = await buildBackgroundBuffer(
    backgroundBuffer,
    cardWidthPt,
    cardHeightPt,
  );

  if (single) {
    const x = (pageWidthPt - cardWidthPt) / 2;
    const y = (pageHeightPt - cardHeightPt) / 2;
    await drawCard({
      doc,
      x,
      y,
      width: cardWidthPt,
      height: cardHeightPt,
      name: members[0].nombre,
      titleText,
      footerText,
      logoBuffer: preparedLogo,
      backgroundBuffer: preparedBackground,
    });
    return doc;
  }

  const gapPt = mmToPt(GRID.gap);
  const totalWidthPt = GRID.cols * cardWidthPt + (GRID.cols - 1) * gapPt;
  const totalHeightPt = GRID.rows * cardHeightPt + (GRID.rows - 1) * gapPt;
  const startX = (pageWidthPt - totalWidthPt) / 2;
  const startY = (pageHeightPt - totalHeightPt) / 2;
  const perPage = GRID.cols * GRID.rows;

  for (let index = 0; index < members.length; index += 1) {
    if (index > 0 && index % perPage === 0) {
      doc.addPage({ size: 'A4', margin: 0 });
    }
    const pageIndex = index % perPage;
    const col = pageIndex % GRID.cols;
    const row = Math.floor(pageIndex / GRID.cols);
    const x = startX + col * (cardWidthPt + gapPt);
    const y = startY + row * (cardHeightPt + gapPt);
    await drawCard({
      doc,
      x,
      y,
      width: cardWidthPt,
      height: cardHeightPt,
      name: members[index].nombre,
      titleText,
      footerText,
      logoBuffer: preparedLogo,
      backgroundBuffer: preparedBackground,
    });
  }

  return doc;
};

