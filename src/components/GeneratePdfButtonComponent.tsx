import { Download, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Member } from '../types';
import { generateVipCardsPdf } from '../services/pdf';

interface GeneratePdfButtonComponentProps {
  members: Member[];
  logo: string | null;
}

export default function GeneratePdfButtonComponent({ members, logo }: GeneratePdfButtonComponentProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = async () => {
    if (isGenerating) return;
    try {
    if (!logo) {
        throw new Error('Falta el logo. Sube un logo antes de generar.');
      }
      setIsGenerating(true);
      const mappedMembers = members.map((member) => ({
        id: member.id,
        nombre: member.nombre,
        generar: member.generar,
        foto: member.foto,
      }));
      await generateVipCardsPdf(mappedMembers, logo);
    } catch (error) {
      console.error('Error generating PDF:', error);
      const message = error instanceof Error ? error.message : 'Error desconocido';
      alert(`Error al generar el PDF: ${message}`);
    } finally {
      setIsGenerating(false);
    }
  };

    const membersToGenerate = members.filter((m) => m.generar && m.nombre.trim().length > 0).length;

  return (
    <button
      onClick={generatePDF}
      disabled={isGenerating || membersToGenerate === 0}
      className="w-full bg-gradient-to-r from-yellow-600 to-yellow-500 text-black font-bold py-4 px-6 rounded-lg hover:from-yellow-500 hover:to-yellow-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg"
    >
      {isGenerating ? (
        <>
          <Loader2 className="animate-spin" size={24} />
          <span>Generando PDF...</span>
        </>
      ) : (
        <>
          <Download size={24} />
          <span>Generar {membersToGenerate} Carnet{membersToGenerate !== 1 ? 's' : ''}</span>
        </>
      )}
    </button>
  );
}
