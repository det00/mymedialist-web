// src/lib/types.ts
export interface CardBuscar {
  autor: string;
  descripcion: string;
  fechaLanzamiento: string;
  genero: string[];
  id_api: string;
  imagen: string;
  item?: {
    id: number;
    estado: string;
  };
  numAmigos: number;
  paginas?: number;
  tipo: string;
  titulo: string;
  plataformas?: string[];
}

export interface Usuario {
  id: number;
  nombre: string;
  username: string;
  avatar: string;
}

export interface Seguidor {
  id: number;
  nombre: string;
  username: string;
  avatar: string;
  ultimaActividad: {
    tipo: string;
    titulo: string;
    fecha: string;
    estado: string;
  };
  contenidosTotales: number;
  contenidosCompartidos: number;
}

export interface Perfil {
  id: string;
  name: string;
  nombre?: string; // Para compatibilidad con código existente
  username: string;
  fechaRegistro: string;
  bio: string;
  totalContenidos: number;
  totalSeguidores: string;
  totalSeguidos: string;
  avatar_id: string;
  avatar?: string; // Para compatibilidad con código existente
  esMiPerfil: boolean;
  siguiendo: boolean;
  estadisticas: {
    completados: number;
    enProgreso: number;
    pendiente: number;
    abandonado: number;
    peliculas: number;
    series: number;
    libros: number;
    juegos: number;
  };
}




export interface CardBasic {
  id: number;
  id_api: string;
  tipo: string;
  titulo: string;
  autor?: string;
  genero?: string[];
  imagen?: string;
  estado: string;
}

export interface ActivityItem {
  autor: string;
  created_at: string;
  estado: "P" | "E" | "C" | "A";
  genero: string[];
  id: number;
  id_api: string;
  userId: number;
  imagen: string | null;
  tipo: "P" | "S" | "L" | "V";
  titulo: string;
  updated_at: string;
}



export type SortOption =
  | "title_asc"
  | "title_desc"
  | "date_desc"
  | "date_asc"
  | "rating_desc";

export interface UseCollectionOptions {
  initialFilters?: {
    tipo?: string;
    estado?: string;
  };
  initialSort?: SortOption;
  autoLoad?: boolean;
  userId: number;
}

export interface ProfileData {
  id: string;
  nombre: string;
  username: string;
  email: string;
  bio?: string;
  fechaRegistro: string;
  totalContenidos: number;
  totalAmigos: number;
  avatar: string;
  esMiPerfil: boolean;
  siguiendo: boolean;
  stats?: {
    totalContent: number;
    completed: number;
    inProgress: number;
    planned: number;
    dropped: number;
    movies: number;
    series: number;
    books: number;
    games: number;
  };
}

export interface LoginResponse {
  token: string;
  id: number;
  name?: string;
  avatar?: string;
  avatar_id?: string;
}

export interface RegisterResponse {
  message: string;
}

export interface UserData {
  nombre: string;
  email: string;
  avatar: string;
}

export interface CollectionFilter {
  tipo?: string;
  estado?: string;
  ordenar?: string;
}

export interface ContentDetail {
  id_api: string;
  imagen?: string | null;
  titulo: string;
  descripcion: string;
  genero?: string[];
  autor?: string;
  paginas?: number;
  fechaLanzamiento?: string;
  duracion?: string;
  temporadas?: number;
  episodios?: number;
  valoracion?: number;
  tipo: string;
  item?: {
    id: string;
    estado: string;
  };
  amigos: {
    id: string;
    estado: string;
    imagen_id?: string;
    progreso?: string;
  }[];
}

export interface ContentItem {
  id_api: string;
  tipo: string;
  titulo: string;
  autor?: string;
  genero?: string[];
  imagen: string | null;
  item?: {
    id: string;
    estado: string;
    fechaAdd?: string;
  };
  numAmigos?: number;
}

// Definiciones de eventos personalizados
declare global {
  interface WindowEventMap {
    contentStateUpdated: CustomEvent<{
      id_api: string;
      tipo: string;
      estado: string;
    }>;
  }
}
