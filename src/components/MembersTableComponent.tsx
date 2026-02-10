import { Edit2, Check, X, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { Member } from '../types';

interface MembersTableComponentProps {
  members: Member[];
  onUpdateMember: (id: string, updates: Partial<Member>) => void;
}

export default function MembersTableComponent({ members, onUpdateMember }: MembersTableComponentProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [editFoto, setEditFoto] = useState('');

  const startEdit = (member: Member) => {
    setEditingId(member.id);
    setEditValue(member.nombre);
    setEditFoto(member.foto ?? '');
  };

  const saveEdit = (id: string) => {
    const trimmedFoto = editFoto.trim();
    onUpdateMember(id, { nombre: editValue.trim(), foto: trimmedFoto.length > 0 ? trimmedFoto : undefined });
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue('');
    setEditFoto('');
  };

  const toggleGenerar = (member: Member) => {
    onUpdateMember(member.id, { generar: !member.generar });
  };

  if (members.length === 0) {
    return null;
  }

  const toGenerate = members.filter((m) => m.generar).length;

  return (
    <div className="bg-gray-900 rounded-lg p-6 border-2 border-yellow-600">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-yellow-500">Miembros Cargados</h2>
        <span className="text-sm text-gray-300">
          Total: <span className="text-yellow-500 font-bold">{members.length}</span> |
          A generar: <span className="text-green-500 font-bold">{toGenerate}</span>
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-300">
          <thead className="text-xs uppercase bg-black text-yellow-500 border-b-2 border-yellow-600">
            <tr>
              <th className="px-6 py-3">Nombre</th>
              <th className="px-6 py-3">Foto</th>
              <th className="px-6 py-3 text-center">Generar</th>
              <th className="px-6 py-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id} className="border-b border-gray-700 hover:bg-gray-800">
                <td className="px-6 py-4">
                  {editingId === member.id ? (
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="bg-gray-800 border border-yellow-600 text-white px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500 w-full"
                      autoFocus
                    />
                  ) : (
                    <span className="font-medium">{member.nombre}</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {editingId === member.id ? (
                    <input
                      type="text"
                      value={editFoto}
                      onChange={(e) => setEditFoto(e.target.value)}
                      className="bg-gray-800 border border-yellow-600 text-white px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500 w-full"
                      placeholder="cromo_131.png"
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{member.foto ?? '-'}</span>
                      {!member.foto && (
                        <span className="text-yellow-500" title="Falta foto">
                          <AlertTriangle size={16} />
                        </span>
                      )}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => toggleGenerar(member)}
                    disabled={editingId !== null}
                    className={`px-3 py-1 rounded font-semibold transition-colors ${
                      member.generar
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-red-600 text-white hover:bg-red-700'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {member.generar ? 'SI' : 'NO'}
                  </button>
                </td>
                <td className="px-6 py-4 text-center">
                  {editingId === member.id ? (
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => saveEdit(member.id)}
                        className="text-green-500 hover:text-green-400"
                      >
                        <Check size={20} />
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="text-red-500 hover:text-red-400"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => startEdit(member)}
                      disabled={editingId !== null}
                      className="text-yellow-500 hover:text-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Edit2 size={20} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
