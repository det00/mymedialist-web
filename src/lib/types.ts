export interface Buscar {
  empty?: unknown;
  id_api?: number | string;
  tipo?: string;
  imagen: string;
  titulo: string;
  descripcion?: string;
  genero?: string[];
  creador?: string;
  autor?: string;
  fechaLanzamiento?: string;
  numAmigos?: number;
}

export interface Contenido {
  estado: string;
  id_api: string;
  imagen?: string;
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

export interface BuscarPageProps {
  searchParams: { busqueda: string; tipo: string };
}


export interface ActivityItem {
  id: number;
  userId: number;
  contentTitle: string;
  contentId: number;
  contentApiId: string;
  contentType: "P" | "S" | "L" | "V";
  contentImage: string | null;
  actionType: "added" | "started" | "finished" | "dropped";
  timestamp: string;
  status: string;
}


export type SortOption = "title_asc" | "title_desc" | "date_desc" | "date_asc" | "rating_desc";

export interface UseCollectionOptions {
  initialFilters?: {
    tipo?: string;
    estado?: string;
  };
  initialSort?: SortOption;
  autoLoad?: boolean;
}


export interface ProfileData {
  id: string;
  nombre: string;
  username: string;
  email: string
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