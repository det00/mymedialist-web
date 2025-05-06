import { useState, useEffect, useMemo, useCallback } from 'react';
import { CardBasic, CollectionFilter, SortOption, UseCollectionOptions } from "@/lib/types";
import { authService } from "@/lib/auth";
import collectionService from "@/lib/collection";

export function useCollection(options: UseCollectionOptions) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [collection, setCollection] = useState<CardBasic[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<CollectionFilter>(options.initialFilters || {});
  const [sortOption, setSortOption] = useState<SortOption>(options.initialSort || "title_asc");
  const [stats, setStats] = useState({
    total: 0,
    byStatus: {C: 0, E: 0, P: 0, A: 0},
    byType: {P: 0, S: 0, L: 0, V: 0}
  });

  // Función para ordenar la colección (definida antes de usarse)
  const sortCollection = useCallback((data: CardBasic[], sort: SortOption): CardBasic[] => {
    const sortedData = [...data];

    switch (sort) {
      case "title_asc":
        return sortedData.sort((a, b) => a.titulo.localeCompare(b.titulo));
      case "title_desc":
        return sortedData.sort((a, b) => b.titulo.localeCompare(a.titulo));
      default:
        return sortedData;
    }
  }, []);

  // Verificar autenticación
  useEffect(() => {
    setIsAuthenticated(authService.isAuthenticated());
  }, []);

  // Cargar colección una sola vez al inicio
  useEffect(() => {
    if (options.autoLoad !== false && isAuthenticated) {
      loadCollection(options.userId);
    }
  }, [isAuthenticated]); // Solo cuando cambia la autenticación

  // Filtrado y ordenado en memoria
  const filteredCollection = useMemo(() => {
    let filtered = [...collection];

    // Filtrar por tipo
    if (filters.tipo && filters.tipo !== "todo") {
      const tipoMayuscula = filters.tipo.charAt(0).toUpperCase();
      filtered = filtered.filter(item =>
        item.tipo && item.tipo.charAt(0).toUpperCase() === tipoMayuscula
      );
    }

    // Filtrar por estado
    if (filters.estado && filters.estado !== "todo") {
      filtered = filtered.filter(item => item.estado === filters.estado);
    }

    // Ordenar
    const sorted = sortCollection(filtered, sortOption);
    return sorted;
  }, [collection, filters.tipo, filters.estado, sortOption, sortCollection]);

  // Estados derivados para compatibilidad
  const enProgreso = useMemo(() => 
    collection.filter(item => item.estado === "E"), 
    [collection]
  );
  
  const completado = useMemo(() => 
    collection.filter(item => item.estado === "C"), 
    [collection]
  );
  
  const pendiente = useMemo(() => 
    collection.filter(item => item.estado === "P"), 
    [collection]
  );
  
  const abandonado = useMemo(() => 
    collection.filter(item => item.estado === "A"), 
    [collection]
  );
  
  const pelicula = useMemo(() => 
    collection.filter(item => item.tipo === "P"), 
    [collection]
  );
  
  const serie = useMemo(() => 
    collection.filter(item => item.tipo === "S"), 
    [collection]
  );
  
  const libro = useMemo(() => 
    collection.filter(item => item.tipo === "L"), 
    [collection]
  );
  
  const juego = useMemo(() => 
    collection.filter(item => item.tipo === "V"), 
    [collection]
  );

  // Función para cargar la colección
  const loadCollection = async (userID?: number) => {
    if (!isAuthenticated) {
      setError("No has iniciado sesión");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await collectionService.getAllContent(userID);
      setCollection(data);

      // Calcular estadísticas
      const statsData = {
        total: data.length,
        byStatus: {
          C: data.filter(item => item.estado === 'C').length,
          E: data.filter(item => item.estado === 'E').length,
          P: data.filter(item => item.estado === 'P').length,
          A: data.filter(item => item.estado === 'A').length
        },
        byType: {
          P: data.filter(item => item.tipo === 'P').length,
          S: data.filter(item => item.tipo === 'S').length,
          L: data.filter(item => item.tipo === 'L').length,
          V: data.filter(item => item.tipo === 'V').length
        }
      };
      setStats(statsData);
    } catch (err) {
      console.error("Error al cargar la colección:", err);
      setError("No se pudo cargar la colección");
    } finally {
      setLoading(false);
    }
  };

  // Función para actualizar los filtros
  const updateFilters = (newFilters: Partial<CollectionFilter>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  };

  // Función para actualizar el orden
  const updateSort = (newSort: SortOption) => {
    setSortOption(newSort);
  };

  // Función para limpiar todos los filtros
  const clearFilters = () => {
    setFilters({});
  };

  return {
    isAuthenticated,
    collection,
    completado,
    enProgreso,
    pendiente,
    abandonado,
    pelicula,
    libro,
    serie,
    juego,
    filteredCollection,
    loading,
    error,
    filters,
    sortOption,
    stats,
    loadCollection,
    updateFilters,
    updateSort,
    clearFilters
  };
}

export default useCollection;