import { Upload } from 'lucide-react';
import * as XLSX from 'xlsx';
import { Member } from '../types';

const normalizeString = (value: unknown) => String(value ?? '').trim();
const normalizeGenerar = (value: unknown) => normalizeString(value).toUpperCase() === 'SI';
const normalizeFoto = (value: unknown) => {
  const text = normalizeString(value);
  return text.length > 0 ? text : undefined;
};
const generateId = (size = 10) => {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const bytes = new Uint8Array(size);
  window.crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => alphabet[b % alphabet.length]).join('');
};

interface UploadExcelComponentProps {
  onDataLoad: (members: Member[]) => void;
}

export default function UploadExcelComponent({ onDataLoad }: UploadExcelComponentProps) {
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = event.target?.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, {
        defval: '',
      });

      const members: Member[] = rows.map((row) => ({
        id: generateId(),
        nombre: normalizeString(row.Nombre ?? row.nombre ?? ''),
        generar: normalizeGenerar(row.Generar ?? row.generar ?? 'NO'),
        foto: normalizeFoto(row.Foto ?? row.foto ?? ''),
      }));

      onDataLoad(members);
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="bg-gray-900 rounded-lg p-6 border-2 border-yellow-600">
      <h2 className="text-xl font-bold text-yellow-500 mb-4">Subir Archivo Excel</h2>
      <div className="flex items-center justify-center w-full">
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-yellow-600 border-dashed rounded-lg cursor-pointer bg-black hover:bg-gray-800 transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-10 h-10 mb-3 text-yellow-500" />
            <p className="mb-2 text-sm text-gray-300">
              <span className="font-semibold">Click para subir</span> o arrastra el archivo
            </p>
            <p className="text-xs text-gray-400">Excel (.xlsx, .xls)</p>
          </div>
          <input
            type="file"
            className="hidden"
            accept=".xlsx,.xls"
            onChange={handleFileUpload}
          />
        </label>
      </div>
    </div>
  );
}
