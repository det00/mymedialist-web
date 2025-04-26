import { useState, useEffect } from 'react';
import { CollectionFilter, Contenido, SortOption, UseCollectionOptions } from "@/lib/types";
import { homeService } from "@/lib/home";
import { authService } from "@/lib/auth";

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
      // Usar homeService para obtener todo el contenido
      const data = await homeService.getAllContent();
      
      // Aplicar filtros
      let filteredData = [...data];
      
      if (filters.tipo && filters.tipo !== "todo") {
        const tipoMayuscula = filters.tipo.charAt(0).toUpperCase();
        filteredData = filteredData.filter(item => 
          item.tipo && item.tipo.charAt(0).toUpperCase() === tipoMayuscula
        );
      }
      
      if (filters.estado && filters.estado !== "todo") {
        filteredData = filteredData.filter(item => item.estado === filters.estado);
      }

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

      // Aplicar ordenación
      const sorted = sortCollection(filteredData, sortOption);
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
      // Usar homeService para actualizar estado
      const result = await homeService.updateItemState(id_api, tipo, estado);
      
      // Recargar la colección para reflejar los cambios
      await loadCollection(true);
      
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
      // Buscar el item en la colección actual para obtener id_api y tipo
      const itemToUpdate = collection.find(item => item.id === id);
      
      if (!itemToUpdate) {
        setError("No se encontró el elemento");
        return null;
      }

      // Usar homeService para actualizar estado
      const result = await homeService.updateItemState(
        itemToUpdate.id_api, 
        itemToUpdate.tipo, 
        estado
      );
      
      // Recargar la colección para reflejar los cambios
      await loadCollection(true);
      
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
      // Buscar el item en la colección actual para obtener id_api y tipo
      const itemToRemove = collection.find(item => item.id === id);
      
      if (!itemToRemove) {
        setError("No se encontró el elemento");
        return null;
      }

      // Usar homeService para actualizar estado a vacío (desmarcar)
      const result = await homeService.updateItemState(
        itemToRemove.id_api, 
        itemToRemove.tipo, 
        ""
      );
      
      // Recargar la colección para reflejar los cambios
      await loadCollection(true);
      
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