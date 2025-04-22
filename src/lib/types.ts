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
  tipo: string; // Esta propiedad ahora es requerida, no opcional
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