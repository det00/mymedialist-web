// src/lib/constants.ts

// Mapeo de tipo de contenido a sus nombres completos
export const CONTENT_TYPE_NAMES: Record<string, string> = {
    P: "Película",
    S: "Serie",
    L: "Libro",
    V: "Videojuego",
  };
  
  // Mapeo de tipo de contenido a URL para rutas
  export const CONTENT_TYPE_URLS: Record<string, string> = {
    P: "pelicula",
    S: "serie",
    L: "libro",
    V: "videojuego",
  };
  
  // Mapeo de estado a nombres legibles
  export const STATUS_NAMES: Record<string, string> = {
    C: "Completado",
    E: "En progreso",
    P: "Pendiente",
    A: "Abandonado",
  };
  
  // Mapeo de tipo de acción a descripciones
  export const ACTION_DESCRIPTIONS: Record<string, string> = {
    added: "ha añadido",
    started: "ha empezado",
    finished: "ha completado",
    dropped: "ha abandonado",
  };
  
  // Mapeo de estado a colores
  export const STATUS_COLORS: Record<string, string> = {
    C: "text-green-500",
    E: "text-blue-500",
    P: "text-yellow-500",
    A: "text-red-500",
  };
  
  // Mapeo de estado a colores de fondo
  export const STATUS_BG_COLORS: Record<string, string> = {
    C: "bg-green-500",
    E: "bg-blue-500",
    P: "bg-amber-500",
    A: "bg-red-500",
  };
  
  // Filtros de tiempo para actividad
  export const TIME_FILTERS = [
    { id: "all", name: "Todo el tiempo" },
    { id: "today", name: "Hoy" },
    { id: "week", name: "Últimos 7 días" },
    { id: "month", name: "Último mes" },
  ];
  
  // Filtros de tipo de contenido para actividad
  export const CONTENT_TYPE_FILTERS = [
    { id: "all", name: "Todo" },
    { id: "P", name: "Películas" },
    { id: "S", name: "Series" },
    { id: "L", name: "Libros" },
    { id: "V", name: "Videojuegos" },
  ];
  
  // Filtros de acción para actividad
  export const ACTION_TYPE_FILTERS = [
    { id: "all", name: "Todas las acciones" },
    { id: "added", name: "Pendientes" },
    { id: "started", name: "En progreso" },
    { id: "finished", name: "Completados" },
    { id: "dropped", name: "Abandonados" },
  ];