export interface Member {
  id: string;
  nombre: string;
  generar: boolean;
  foto?: string;
}

export interface AppState {
  members: Member[];
  logo: string | null;
  background: string | null;
}
