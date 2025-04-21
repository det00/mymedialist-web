// src/hooks/useActivity.ts
import { useState, useEffect } from "react";
import { activityService, ActivityItem } from "@/lib/activity";

export function useActivity(userId?: string) {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [timeFilter, setTimeFilter] = useState<string>("all");
  const [contentType, setContentType] = useState<string>("all");
  const [activityType, setActivityType] = useState<string>("all");
  const ITEMS_PER_PAGE = 10;

  // Cargar actividad del usuario
  const loadActivity = async (resetPage: boolean = false) => {
    try {
      setLoading(true);
      
      // Si se resetea la página, volver a la primera
      const currentPage = resetPage ? 1 : page;
      
      // Obtener actividad según si es para un usuario específico o el usuario actual
      let data: ActivityItem[];
      if (userId) {
        data = await activityService.getUserActivity(userId, currentPage, ITEMS_PER_PAGE);
      } else {
        data = await activityService.getMyActivity(currentPage, ITEMS_PER_PAGE);
      }
      
      // Actualizar estado
      if (resetPage) {
        setActivities(data);
        setPage(1);
      } else {
        setActivities(prevActivities => [...prevActivities, ...data]);
      }
      
      // Verificar si hay más páginas
      setHasMore(data.length >= ITEMS_PER_PAGE);
      
      setError(null);
    } catch (err) {
      console.error("Error al cargar actividad:", err);
      setError("No se pudo cargar la actividad. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  // Cargar más actividad (paginación)
  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(prevPage => prevPage + 1);
    }
  };

  // Filtrar actividad por tipo de contenido
  const filterByContentType = (type: string) => {
    setContentType(type);
    
    // Resetear la carga cuando se cambia el filtro
    loadActivity(true);
  };

  // Filtrar actividad por tipo de acción
  const filterByActivityType = (type: string) => {
    setActivityType(type);
    
    // Resetear la carga cuando se cambia el filtro
    loadActivity(true);
  };

  // Filtrar actividad por tiempo
  const filterByTime = (timeRange: string) => {
    setTimeFilter(timeRange);
    
    // Resetear la carga cuando se cambia el filtro
    loadActivity(true);
  };

  // Cargar actividad cuando cambia el usuario o la página
  useEffect(() => {
    loadActivity();
  }, [userId, page]);

  // Cargar actividad cuando cambian los filtros
  useEffect(() => {
    loadActivity(true);
  }, [timeFilter, contentType, activityType]);

  return {
    activities,
    loading,
    error,
    hasMore,
    timeFilter,
    contentType,
    activityType,
    filterByContentType,
    filterByActivityType,
    filterByTime,
    loadMore,
    refreshActivity: () => loadActivity(true)
  };
}