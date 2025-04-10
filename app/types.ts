export interface Buscar {
  id_api?: number;
  tipo?: string;
  imagen: string;
  titulo: string;
  descripcion?: string;
  genero: string[];
  creador?: string;
  autor?: string;
  fechaLanzamiento: string;
  numAmigos: number
}

export interface Contenido {
  id_api: string;
  imagen: string;
  titulo: string;
  descripcion: string;
  genero: string[];
  autor: string;
  paginas: number;
  fechaLanzamiento: string;
  item?: {  
    id: string;
    estado: string;
  };
  amigos: {
    id: string;
    estado: string;
    imagen_id: string;
  }[];
}

export interface BuscarPageProps {
  searchParams: { busqueda: string; tipo: string };
}
