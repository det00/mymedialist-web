import { useState, useEffect } from 'react';
import { Contenido } from "@/lib/types";
import { collectionService, CollectionFilter } from "@/lib/collection";
import { authService } from "@/lib/auth";

export type SortOption = "title_asc" | "title_desc" | "date_desc" | "date_asc" | "rating_desc";

export interface UseCollectionOptions {
  initialFilters?: {
    tipo?: string;
    estado?: string;
  };
  initialSort?: SortOption;
  autoLoad?: boolean;
}

/**
 * Hook personalizado para gestionar la colección de contenidos del usuario
 */
export function useCollection(options: UseCollectionOptions = {}) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [collection, setCollection] = useState<Contenido[]>([]);
  const [filteredCollection, setFilteredCollection] = useState<Contenido[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<CollectionFilter>(options.initialFilters || {});
  const [sortOption, setSortOption] = useState<SortOption>(options.initialSort || "title_asc");
  const [stats, setStats] = useState({
    total: 0,
    byStatus: { C: 0, E: 0, P: 0, A: 0 },
    byType: { P: 0, S: 0, L: 0, V: 0 }
  });

  // Verificar autenticación
  useEffect(() => {
    setIsAuthenticated(authService.isAuthenticated());
  }, []);

  // Cargar colección cuando cambia el estado de autenticación o los filtros
  useEffect(() => {
    if (options.autoLoad !== false && isAuthenticated) {
      loadCollection();
    }
  }, [isAuthenticated, filters.tipo, filters.estado]);

  // Función para cargar la colección
  const loadCollection = async (forceRefresh: boolean = false) => {
    if (!isAuthenticated) {
      setError("No has iniciado sesión");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Cargar la colección con los filtros aplicados
      const data = await collectionService.getUserCollection({
        ...filters
      });
      setCollection(data);

      // Obtener las estadísticas
      const statsData = await collectionService.getCollectionStats();
      setStats(statsData);

      // Aplicar ordenación
      const sorted = sortCollection(data, sortOption);
      setFilteredCollection(sorted);
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
    
    // Reordenar la colección actual
    const sorted = sortCollection(collection, newSort);
    setFilteredCollection(sorted);
  };

  // Función para ordenar la colección
  const sortCollection = (data: Contenido[], sort: SortOption): Contenido[] => {
    const sortedData = [...data];
    
    switch (sort) {
      case "title_asc":
        return sortedData.sort((a, b) => a.titulo.localeCompare(b.titulo));
      case "title_desc":
        return sortedData.sort((a, b) => b.titulo.localeCompare(a.titulo));
      case "date_desc":
        return sortedData.sort((a, b) => {
          const yearA = a.fechaLanzamiento?.match(/(\d{4})/)?.[1] || "0";
          const yearB = b.fechaLanzamiento?.match(/(\d{4})/)?.[1] || "0";
          return parseInt(yearB) - parseInt(yearA);
        });
      case "date_asc":
        return sortedData.sort((a, b) => {
          const yearA = a.fechaLanzamiento?.match(/(\d{4})/)?.[1] || "0";
          const yearB = b.fechaLanzamiento?.match(/(\d{4})/)?.[1] || "0";
          return parseInt(yearA) - parseInt(yearB);
        });
      case "rating_desc":
        return sortedData.sort((a, b) => (b.valoracion || 0) - (a.valoracion || 0));
      default:
        return sortedData;
    }
  };

  // Función para añadir un ítem a la colección
  const addToCollection = async (id_api: string, tipo: string, estado: string) => {
    if (!isAuthenticated) {
      setError("No has iniciado sesión");
      return null;
    }

    try {
      // Usar homeService para asegurar compatibilidad
      const result = await collectionService.addToCollection(id_api, tipo, estado);
      await loadCollection(true); // Recargar la colección
      return result;
    } catch (err) {
      console.error("Error al añadir a la colección:", err);
      setError("No se pudo añadir a la colección");
      return null;
    }
  };

  // Función para actualizar un ítem de la colección
  const updateItem = async (id: string, estado: string) => {
    if (!isAuthenticated) {
      setError("No has iniciado sesión");
      return null;
    }

    try {
      const result = await collectionService.updateItem(id, estado);
      await loadCollection(true); // Recargar la colección
      return result;
    } catch (err) {
      console.error("Error al actualizar elemento:", err);
      setError("No se pudo actualizar el elemento");
      return null;
    }
  };

  // Función para eliminar un ítem de la colección
  const removeFromCollection = async (id: string) => {
    if (!isAuthenticated) {
      setError("No has iniciado sesión");
      return null;
    }

    try {
      const result = await collectionService.removeFromCollection(id);
      await loadCollection(true); // Recargar la colección
      return result;
    } catch (err) {
      console.error("Error al eliminar de la colección:", err);
      setError("No se pudo eliminar de la colección");
      return null;
    }
  };

  // Función para limpiar todos los filtros
  const clearFilters = () => {
    setFilters({});
  };

  return {
    isAuthenticated,
    collection,
    filteredCollection,
    loading,
    error,
    filters,
    sortOption,
    stats,
    loadCollection,
    updateFilters,
    updateSort,
    addToCollection,
    updateItem,
    removeFromCollection,
    clearFilters
  };
}

export default useCollection;