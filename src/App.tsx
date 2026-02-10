import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Member } from './types';
import UploadExcelComponent from './components/UploadExcelComponent';
import UploadLogoComponent from './components/UploadLogoComponent';
import UploadBackgroundComponent from './components/UploadBackgroundComponent';
import MembersTableComponent from './components/MembersTableComponent';
import CardPreviewComponent from './components/CardPreviewComponent';
import GeneratePdfButtonComponent from './components/GeneratePdfButtonComponent';
import { downloadMembersJson } from './services/membersJson';

function App() {
  const [members, setMembers] = useState<Member[]>([]);
  const [logo, setLogo] = useState<string | null>(null);
  const [background, setBackground] = useState<string | null>(null);

  const handleDataLoad = (loadedMembers: Member[]) => {
    setMembers(loadedMembers);
  };

  const handleLogoUpload = (logoData: string) => {
    setLogo(logoData);
  };

  const handleBackgroundUpload = (backgroundData: string) => {
    setBackground(backgroundData);
  };

  const handleUpdateMember = (id: string, updates: Partial<Member>) => {
    setMembers((prev) =>
      prev.map((member) =>
        member.id === id ? { ...member, ...updates } : member
      )
    );
  };

  const loadDemoData = () => {
    const demoMembers: Member[] = [
      { id: 'demo01a2', nombre: 'JUAN GARCIA LOPEZ', generar: true, foto: 'cromo_1.png' },
      { id: 'demo02b3', nombre: 'MARIA RODRIGUEZ PEREZ', generar: true, foto: 'cromo_2.jpg' },
      { id: 'demo03c4', nombre: 'CARLOS MARTINEZ SANCHEZ', generar: false },
      { id: 'demo04d5', nombre: 'ANA FERNANDEZ GONZALEZ', generar: true, foto: 'cromo_4.png' },
      { id: 'demo05e6', nombre: 'LUIS LOPEZ DIAZ', generar: true },
      { id: 'demo06f7', nombre: 'CARMEN HERNANDEZ RUIZ', generar: false },
    ];
    setMembers(demoMembers);
  };

  const previewMember = members.find((m) => m.generar) || null;

  return (
    <div className="min-h-screen bg-black">
      <div className="bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 py-6 px-4 shadow-2xl">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center gap-3">
            <Sparkles className="text-black" size={32} />
            <h1 className="text-3xl md:text-4xl font-bold text-black text-center">
              Generador Carnets VIP
            </h1>
            <Sparkles className="text-black" size={32} />
          </div>
          <p className="text-center text-black font-semibold mt-2">
            Falla Alemania - El Bachiller
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <UploadExcelComponent onDataLoad={handleDataLoad} />
          <UploadLogoComponent logo={logo} onLogoUpload={handleLogoUpload} />
          <UploadBackgroundComponent background={background} onBackgroundUpload={handleBackgroundUpload} />
        </div>

        {members.length === 0 && (
          <div className="text-center py-8">
            <button
              onClick={loadDemoData}
              className="bg-yellow-600 hover:bg-yellow-500 text-black font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Cargar Datos de Prueba
            </button>
          </div>
        )}

        {members.length > 0 && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-2">
                <MembersTableComponent
                  members={members}
                  onUpdateMember={handleUpdateMember}
                />
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => downloadMembersJson(members)}
                    className="bg-yellow-600 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded-lg transition-colors"
                  >
                    Descargar members.json
                  </button>
                </div>
              </div>
              <div>
                <CardPreviewComponent member={previewMember} logo={logo} background={background} />
              </div>
            </div>

            <div className="max-w-md mx-auto">
              <GeneratePdfButtonComponent members={members} logo={logo} />
            </div>
          </>
        )}
      </div>

      <footer className="mt-12 py-6 border-t border-yellow-600">
        <p className="text-center text-gray-400 text-sm">
          Generador Carnets VIP - Fallas Alemania El Bachiller
        </p>
      </footer>
    </div>
  );
}

export default App;
