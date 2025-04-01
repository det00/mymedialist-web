export interface Buscar {
    id_api?: number;
    tipo?: string;
    imagen: string
    titulo: string
    descripcion?: string
    genero: string[] 
    creador?: string
    autor?: string
    fechaLanzamiento: string
  }


 export interface BuscarPageProps {
    searchParams: { busqueda: string; tipo: string };
}
