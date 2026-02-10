import { Member } from '../types';
import VIPCard from './VIPCard';

interface CardPreviewComponentProps {
  member: Member | null;
  logo: string | null;
  background: string | null;
}

export default function CardPreviewComponent({ member, logo, background }: CardPreviewComponentProps) {
  const displayMember = member || { nombre: 'JUAN GARCIA LOPEZ', generar: true as const };

  return (
    <div className="bg-gray-900 rounded-lg p-6 border-2 border-yellow-600">
      <h2 className="text-xl font-bold text-yellow-500 mb-4">Vista Previa del Carnet</h2>
      <div className="flex justify-center items-center">
        <VIPCard nombre={displayMember.nombre} logo={logo} background={background} />
      </div>
    </div>
  );
}
