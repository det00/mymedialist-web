import { useState, useEffect, useMemo } from "react";
import { activityService } from "@/lib/activity";
import { ActivityItem } from "@/lib/types";
import moment from "moment";

export function useActivity(userId: string | number) {
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

      const currentPage = resetPage ? 1 : page;

      // Obtener datos del servidor sin filtros
      const data = await activityService.getUserActivity(
        typeof userId === 'string' ? parseInt(userId) : userId,
        currentPage,
        ITEMS_PER_PAGE
      );
      
      if (resetPage) {
        setActivities(data);
        setPage(1);
      } else {
        setActivities(prevActivities => [...prevActivities, ...data]);
      }

      setHasMore(data.length >= ITEMS_PER_PAGE);
      
      setError(null);
    } catch (err) {
      console.error("Error al cargar actividad:", err);
      setError("No se pudo cargar la actividad. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  // Filtrar actividades localmente
  const filteredActivities = useMemo(() => {
    let filtered = [...activities];

    // Filtrar por tipo de contenido
    if (contentType !== "all") {
      filtered = filtered.filter(item => item.tipo === contentType);
    }

    // Filtrar por tipo de actividad
    if (activityType !== "all") {
      // El tipo de actividad debe basarse en el estado
      const actionTypeMap: Record<string, string> = {
        "E": "started",   // En progreso = started
        "C": "finished",  // Completado = finished
        "P": "added",     // Pendiente = added
        "A": "dropped"    // Abandonado = dropped
      };
      filtered = filtered.filter(item => actionTypeMap[item.estado] === activityType);
    }

    // Filtrar por tiempo
    if (timeFilter !== "all") {
      const now = moment();
      filtered = filtered.filter(item => {
        const itemDate = moment(item.created_at);
        
        switch (timeFilter) {
          case "today":
            return itemDate.isSame(now, 'day');
          case "week":
            return itemDate.isAfter(now.clone().subtract(7, 'days'));
          case "month":
            return itemDate.isAfter(now.clone().subtract(1, 'month'));
          default:
            return true;
        }
      });
    }

    return filtered;
  }, [activities, contentType, activityType, timeFilter]);

  // Cargar más actividad (paginación)
  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(prevPage => prevPage + 1);
    }
  };

  // Filtrar actividad por tipo de contenido
  const filterByContentType = (type: string) => {
    setContentType(type);
  };

  // Filtrar actividad por tipo de acción
  const filterByActivityType = (type: string) => {
    setActivityType(type);
  };

  // Filtrar actividad por tiempo
  const filterByTime = (timeRange: string) => {
    setTimeFilter(timeRange);
  };

  // Cargar actividad cuando cambia el usuario o la página
  useEffect(() => {
    loadActivity();
  }, [userId, page]);

  // No necesitamos recargar cuando cambian los filtros, solo aplicarlos
  useEffect(() => {
    // Solo resetear si necesitamos cargar desde el servidor
  }, [timeFilter, contentType, activityType]);

  return {
    activities: filteredActivities,
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
