import xlsx from 'xlsx';

const normalizeHeader = (value) =>
  String(value ?? '')
    .trim()
    .toLowerCase();

const normalizeNombre = (value) => String(value ?? '').trim();

const normalizeGenerar = (value) => {
  const text = String(value ?? '').trim().toLowerCase();
  return text === 'si';
};

export const parseExcelBuffer = (buffer) => {
  const workbook = xlsx.read(buffer, { type: 'buffer' });
  const firstSheetName = workbook.SheetNames[0];

  if (!firstSheetName) {
    throw new Error('No sheets found in Excel file.');
  }

  const sheet = workbook.Sheets[firstSheetName];
  const rows = xlsx.utils.sheet_to_json(sheet, { header: 1, defval: '' });

  if (!rows.length) {
    throw new Error('Excel is empty.');
  }

  const headerRow = rows[0];
  const normalizedHeaders = headerRow.map(normalizeHeader);

  const nombreIndex = normalizedHeaders.findIndex((h) => h === 'nombre');
  const generarIndex = normalizedHeaders.findIndex((h) => h === 'generar');

  if (nombreIndex === -1 || generarIndex === -1) {
    const detected = headerRow.map((value) => String(value ?? '').trim()).filter(Boolean);
    throw new Error(`Missing required columns. Detected: ${detected.join(', ')}`);
  }

  const members = rows.slice(1).map((row) => {
    const nombre = normalizeNombre(row[nombreIndex]);
    const generar = normalizeGenerar(row[generarIndex]);
    return { nombre, generar };
  }).filter((member) => member.nombre.length > 0);

  return {
    members,
    columnsDetected: headerRow.map((value) => String(value ?? '').trim()).filter(Boolean),
  };
};

