import { Member } from '../types';

export type MembersJson = Record<string, { nombre: string; foto: string | null }>;

export const buildMembersJson = (members: Member[]): MembersJson => {
  return members.reduce<MembersJson>((acc, member) => {
    acc[member.id] = {
      nombre: member.nombre.trim(),
      foto: member.foto ? `/fotos/${encodeURI(member.foto.trim())}` : null,
    };
    return acc;
  }, {});
};

export const downloadMembersJson = (members: Member[]): void => {
  const data = buildMembersJson(members);
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'members.json';
  link.click();
  URL.revokeObjectURL(url);
};

