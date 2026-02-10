import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

type MembersJson = Record<string, { nombre: string; foto: string | null }>;

export default function QrProfilePage() {
  const { id } = useParams();
  const [entry, setEntry] = useState<MembersJson[string] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState(false);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await fetch('/members.json', { cache: 'no-store' });
        if (!res.ok) {
          throw new Error(
            'No existe members.json en el servidor. Colócalo en /public/members.json y vuelve a desplegar.'
          );
        }
        const data = (await res.json()) as MembersJson;
        if (!id || !data[id]) {
          setError('No se encontró el miembro solicitado.');
          return;
        }
        setEntry(data[id]);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error inesperado al cargar members.json.';
        setError(message);
      }
    };

    fetchMembers();
  }, [id]);

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="max-w-xl text-center">
          <h1 className="text-2xl font-bold text-yellow-500 mb-4">Acceso VIP</h1>
          <p className="text-gray-300">{error}</p>
        </div>
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-gray-300">Cargando...</p>
      </div>
    );
  }

  const fotoUrl = entry.foto ? encodeURI(entry.foto) : null;

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-black px-6"
      style={{
        backgroundImage: `url(/fondo.png)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="bg-black/70 border-2 border-yellow-600 rounded-xl px-8 py-10 text-center max-w-md w-full">
        <h1 className="text-yellow-500 text-2xl font-bold mb-2">VIP FALLAS 2026</h1>
        <p className="text-white text-lg font-semibold mb-6">{entry.nombre}</p>
        {fotoUrl && !photoError ? (
          <img
            src={fotoUrl}
            alt={entry.nombre}
            className="w-48 h-48 object-cover rounded-lg mx-auto border border-yellow-600"
            onError={() => setPhotoError(true)}
          />
        ) : (
          <div className="text-white text-2xl font-bold mt-4">
            {entry.nombre.toUpperCase()}
          </div>
        )}
        <p className="text-yellow-500 text-sm font-semibold mt-6">ALEMANIA EL BACHILLER</p>
      </div>
    </div>
  );
}

