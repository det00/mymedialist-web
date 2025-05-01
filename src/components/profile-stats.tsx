import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarRange, Film, Tv, BookOpen, Gamepad2, CheckCircle, Clock, ListTodo, Ban, Star,RefreshCw } from "lucide-react";
import { collectionService } from "@/lib/collection";
import Link from "next/link";
import { CardBasic } from "@/lib/types";

// Componentes para gráficos
interface DonutChartData {
  name: string;
  value: number;
  color: string;
}

const DonutChart = ({ data, colors }: { data: DonutChartData[]; colors: string[]; }) => {
  const total = data.reduce((acc, item) => acc + item.value, 0);
  let cumulativePercent = 0;
  
  return (
    <div className="relative h-48 w-48 mx-auto">
      <svg viewBox="0 0 100 100" className="h-full w-full">
        {data.map((item, index) => {
          const startPercent = cumulativePercent;
          const percent = total > 0 ? (item.value / total) * 100 : 0;
          cumulativePercent += percent;
          
          // Calcular los puntos SVG para el sector circular
          const startX = 50 + 40 * Math.cos(2 * Math.PI * startPercent / 100);
          const startY = 50 + 40 * Math.sin(2 * Math.PI * startPercent / 100);
          const endX = 50 + 40 * Math.cos(2 * Math.PI * cumulativePercent / 100);
          const endY = 50 + 40 * Math.sin(2 * Math.PI * cumulativePercent / 100);
          
          // Determinar si la ruta es un arco grande (más de 180 grados)
          const largeArcFlag = percent > 50 ? 1 : 0;
          
          // Crear la ruta SVG para el sector circular
          const pathData = [
            `M 50 50`,
            `L ${startX} ${startY}`,
            `A 40 40 0 ${largeArcFlag} 1 ${endX} ${endY}`,
            `Z`
          ].join(' ');
          
          return (
            <path 
              key={index} 
              d={pathData} 
              fill={colors[index]} 
              stroke="white" 
              strokeWidth="0.5"
            />
          );
        })}
        {/* Círculo central para el efecto de donut */}
        <circle cx="50" cy="50" r="25" fill="white" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-bold">{total}</p>
          <p className="text-xs text-muted-foreground">Total</p>
        </div>
      </div>
    </div>
  );
};

const BarChart = ({ data, maxValue, valueKey = "value", labelKey = "label", colorKey = "color" }: { data: any[]; maxValue?: number; valueKey?: string; labelKey?: string; colorKey?: string; }) => {
  const max = maxValue || Math.max(...data.map(item => item[valueKey]));
  
  return (
    <div className="space-y-2">
      {data.map((item, index) => {
        const percent = max > 0 ? (item[valueKey] / max) * 100 : 0;
        
        return (
          <div key={index} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span>{item[labelKey]}</span>
              <span className="font-medium">{item[valueKey]}</span>
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 ease-in-out cursor-pointer"
                style={{ width: `${percent}%`, backgroundColor: item[colorKey] }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Estructura para las estadísticas mensuales
interface MonthlyStats {
  month: string;
  count: number;
}

// Estructura para las estadísticas de género
interface GenreStats {
  genre: string;
  count: number;
  color: string;
}

export function ProfileStats() {
  const [activeTab, setActiveTab] = useState("general");
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats[]>([]);
  const [genreStats, setGenreStats] = useState<GenreStats[]>([]);
  const [generosPorTipo, setGenerosPorTipo] = useState({
    P: [] as {genero: string, count: number}[],
    S: [] as {genero: string, count: number}[],
    L: [] as {genero: string, count: number}[],
    V: [] as {genero: string, count: number}[]
  });
  
  // Estados para la colección
  const [coleccion, setColeccion] = useState<CardBasic[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0 as number,
    byStatus: { C: 0, E: 0, P: 0, A: 0 },
    byType: { P: 0, S: 0, L: 0, V: 0 }
  });

  // Función para cargar la colección
  const loadCollection = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Cargar la colección completa
      const result = await collectionService.getAllContent();
      setColeccion(result);
      
      // Cargar estadísticas
      const statsResult = await collectionService.getCollectionStats();
      setStats(statsResult);
    } catch (err) {
      console.error("Error al cargar la colección:", err);
      setError("No se pudo cargar tu colección. Inténtalo de nuevo más tarde.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar datos al montar el componente
  useEffect(() => {
    loadCollection();
  }, [loadCollection]);
  
  // Calcular estadísticas de la colección
  useEffect(() => {
    if (!coleccion || coleccion.length === 0) return;    
    
    // Contar por estado
    const estadisticas: Record<string, number> = {
      C: 0, // Completado
      E: 0, // En progreso
      P: 0, // Pendiente
      A: 0, // Abandonado
    };
    
    // Contar por tipo
    const tipoEstadisticas: Record<string, number> = {
      P: 0, // Películas
      S: 0, // Series
      L: 0, // Libros
      V: 0, // Videojuegos
    };
    
    // Diccionario para contar géneros
    const generos: Record<string, number> = {};
    
    // Diccionario para contar géneros por tipo
    const generosTipo = {
      P: {} as Record<string, number>, 
      S: {} as Record<string, number>,
      L: {} as Record<string, number>,
      V: {} as Record<string, number>
    };
    
    // Procesar cada elemento de la colección
    coleccion.forEach(item => {
      // Contar por estado
      if (item.estado && estadisticas[item.estado as keyof typeof estadisticas] !== undefined) {
        estadisticas[item.estado as keyof typeof estadisticas]++;
      }
      
      // Contar por tipo
      if (item.tipo && tipoEstadisticas[item.tipo as keyof typeof tipoEstadisticas] !== undefined) {
        tipoEstadisticas[item.tipo as keyof typeof tipoEstadisticas]++;
      }
      
      // Contar géneros
      if (item.genero && Array.isArray(item.genero)) {
        item.genero.forEach(genre => {
          // Limpiar y normalizar el nombre del género
          const normalizedGenre = genre.trim();
          if (normalizedGenre) {
            generos[normalizedGenre] = (generos[normalizedGenre] || 0) + 1;
            
            // Contar por tipo
            if (item.tipo && generosTipo[item.tipo as keyof typeof generosTipo]) {
              generosTipo[item.tipo as keyof typeof generosTipo][normalizedGenre] = 
                (generosTipo[item.tipo as keyof typeof generosTipo][normalizedGenre] || 0) + 1;
            }
          }
        });
      }
    });
    
    // Convertir conteo de géneros en array y ordenar
    const genreArray = Object.entries(generos)
      .map(([genre, count]) => ({ genre, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 7);
    
    // Asignar colores a los géneros
    const colors = ["#6C5CE7", "#3B82F6", "#EF4444", "#22C55E", "#F59E0B", "#EC4899", "#FB7185"];
    const genreWithColors: GenreStats[] = genreArray.map((item, index) => ({
      ...item,
      color: colors[index % colors.length]
    }));
    
    // Crear datos de distribución por tipo
    const generosPorTipoArray: Record<string, {genero: string, count: number}[]> = {
      P: Object.entries(generosTipo.P)
        .map(([genero, count]) => ({ genero, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5) as {genero: string, count: number}[],
      S: Object.entries(generosTipo.S)
        .map(([genero, count]) => ({ genero, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5) as {genero: string, count: number}[],
      L: Object.entries(generosTipo.L)
        .map(([genero, count]) => ({ genero, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5) as {genero: string, count: number}[],
      V: Object.entries(generosTipo.V)
        .map(([genero, count]) => ({ genero, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5) as {genero: string, count: number}[]
    };
    
    // Generar datos mensuales (ejemplo simple basado en la fecha actual)
    const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    const monthlyData: MonthlyStats[] = monthNames.map((month, index) => {
      // Distribución aleatoria basada en la cantidad total de la colección
      const count = Math.floor(Math.random() * Math.max(5, coleccion.length / 4));
      return { month, count };
    });
    
    // Actualizar estados
    setMonthlyStats(monthlyData);
    setGenreStats(genreWithColors);
    setGenerosPorTipo(generosPorTipoArray as { 
      P: { genero: string; count: number }[]; 
      S: { genero: string; count: number }[]; 
      L: { genero: string; count: number }[]; 
      V: { genero: string; count: number }[]; 
    });
    
  }, [coleccion]);


  // Si está cargando, mostrar indicador
  if (loading) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
          <p className="text-muted-foreground">Cargando estadísticas...</p>
        </CardContent>
      </Card>
    );
  }

  // Si hay error, mostrar mensaje con opción de reintentar
  if (error) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-12">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={loadCollection} className="cursor-pointer">
            <RefreshCw className="h-4 w-4 mr-2" />
            Reintentar
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  // Si no hay datos, mostrar mensaje 
  if (!coleccion || coleccion.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-12">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">No hay datos disponibles para mostrar estadísticas.</p>
            <Link href="/busqueda?busqueda=&tipo=P">
              <Button className="cursor-pointer">Añadir contenido</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Contar datos para las gráficas
  const countByStatus = stats.byStatus;
  const countByType = stats.byType;
  
  // Datos para las gráficas de donut
  const statusData = [
    { name: "Completados", value: countByStatus.C, color: "#22C55E" },
    { name: "En progreso", value: countByStatus.E, color: "#3B82F6" },
    { name: "Pendientes", value: countByStatus.P, color: "#FACC15" },
    { name: "Abandonados", value: countByStatus.A, color: "#EF4444" }
  ];
  
  const statusColors = statusData.map(item => item.color);
  
  const typeData = [
    { name: "Películas", value: countByType.P, color: "#8B5CF6" },
    { name: "Series", value: countByType.S, color: "#EC4899" },
    { name: "Libros", value: countByType.L, color: "#F59E0B" },
    { name: "Juegos", value: countByType.V, color: "#10B981" }
  ];
  
  const typeColors = typeData.map(item => item.color);
  
  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="general" className="cursor-pointer">General</TabsTrigger>
          <TabsTrigger value="genres" className="cursor-pointer">Géneros</TabsTrigger>
        </TabsList>
        
        {/* Pestaña general */}
        <TabsContent value="general" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Resumen */}
            <Card>
              <CardHeader>
                <CardTitle>Resumen</CardTitle>
                <CardDescription>
                  Visión general de tu colección
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center">
                  <div className="text-3xl font-bold mb-2">{stats.total}</div>
                  <div className="text-sm text-muted-foreground mb-6">Elementos totales</div>
                  
                  <div className="grid grid-cols-2 gap-6 w-full text-center">
                    <div className="flex flex-col items-center">
                      <div className="bg-muted p-3 rounded-full w-12 h-12 flex items-center justify-center mb-2">
                        <CheckCircle className="h-6 w-6 text-green-500" />
                      </div>
                      <div className="text-xl font-bold">{countByStatus.C}</div>
                      <div className="text-xs text-muted-foreground">Completados</div>
                    </div>
                    
                    <div className="flex flex-col items-center">
                      <div className="bg-muted p-3 rounded-full w-12 h-12 flex items-center justify-center mb-2">
                        <Clock className="h-6 w-6 text-blue-500" />
                      </div>
                      <div className="text-xl font-bold">{countByStatus.E}</div>
                      <div className="text-xs text-muted-foreground">En progreso</div>
                    </div>
                    
                    <div className="flex flex-col items-center">
                      <div className="bg-muted p-3 rounded-full w-12 h-12 flex items-center justify-center mb-2">
                        <ListTodo className="h-6 w-6 text-yellow-500" />
                      </div>
                      <div className="text-xl font-bold">{countByStatus.P}</div>
                      <div className="text-xs text-muted-foreground">Pendientes</div>
                    </div>
                    
                    <div className="flex flex-col items-center">
                      <div className="bg-muted p-3 rounded-full w-12 h-12 flex items-center justify-center mb-2">
                        <Ban className="h-6 w-6 text-red-500" />
                      </div>
                      <div className="text-xl font-bold">{countByStatus.A}</div>
                      <div className="text-xs text-muted-foreground">Abandonados</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Estado del contenido */}
            <Card>
              <CardHeader>
                <CardTitle>Estado del contenido</CardTitle>
                <CardDescription>
                  Distribución por estado
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <DonutChart data={statusData} colors={statusColors} />
                
                <div className="grid grid-cols-2 gap-2 mt-4 w-full">
                  {statusData.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm">{item.name}: {item.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Tipo de contenido */}
            <Card>
              <CardHeader>
                <CardTitle>Tipo de contenido</CardTitle>
                <CardDescription>
                  Distribución por categoría
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="mb-4">
                  <DonutChart data={typeData} colors={typeColors} />
                </div>
                
                <div className="grid grid-cols-2 gap-2 w-full">
                  {typeData.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm">{item.name}: {item.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Actividad por mes */}
            <Card>
              <CardHeader>
                <CardTitle>Actividad por mes</CardTitle>
                <CardDescription>
                  Elementos añadidos a tu colección
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end justify-between gap-1">
                  {monthlyStats.map((month, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div 
                        className="w-6 rounded-t-sm bg-primary transition-all hover:bg-primary/80 cursor-pointer"
                        style={{ 
                          height: `${(month.count / 15) * 150}px`,
                          opacity: 0.7 + (month.count / 50)
                        }}
                      />
                      <span className="text-xs mt-1">{month.month}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Pestaña de géneros */}
        <TabsContent value="genres" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Géneros favoritos</CardTitle>
              <CardDescription>
                Basado en tu colección completa
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BarChart 
                data={genreStats}
                maxValue={Math.max(...genreStats.map(item => item.count))}
                valueKey="count"
                labelKey="genre"
                colorKey="color"
              />
            </CardContent>
            <CardFooter>
              <div className="flex justify-between w-full text-sm text-muted-foreground">
                <span>Basado en {stats.total} elementos</span>
                <span className="flex items-center">
                  <CalendarRange className="h-4 w-4 mr-1" /> 
                  Último año
                </span>
              </div>
            </CardFooter>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Géneros por tipo de contenido */}
            <Card>
              <CardHeader>
                <CardTitle>Géneros por tipo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Películas */}
                {generosPorTipo.P.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Film className="h-4 w-4 text-primary" />
                      <h3 className="font-medium">Películas</h3>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {generosPorTipo.P.map((item, index) => (
                        <Badge key={index} className="bg-[#6C5CE7] cursor-pointer">
                          {item.genero} ({item.count})
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Series */}
                {generosPorTipo.S.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Tv className="h-4 w-4 text-primary" />
                      <h3 className="font-medium">Series</h3>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {generosPorTipo.S.map((item, index) => (
                        <Badge key={index} className="bg-[#EC4899] cursor-pointer">
                          {item.genero} ({item.count})
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Libros */}
                {generosPorTipo.L.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="h-4 w-4 text-primary" />
                      <h3 className="font-medium">Libros</h3>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {generosPorTipo.L.map((item, index) => (
                        <Badge key={index} className="bg-[#F59E0B] cursor-pointer">
                          {item.genero} ({item.count})
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Juegos */}
                {generosPorTipo.V.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Gamepad2 className="h-4 w-4 text-primary" />
                      <h3 className="font-medium">Juegos</h3>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {generosPorTipo.V.map((item, index) => (
                        <Badge key={index} className="bg-[#22C55E] cursor-pointer">
                          {item.genero} ({item.count})
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Recomendaciones */}
            <Card>
              <CardHeader>
                <CardTitle>Basado en tus gustos</CardTitle>
                <CardDescription>
                  Géneros que podrían interesarte
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {genreStats.slice(0, 3).map((genre, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <h3 className="font-medium flex items-center gap-2 mb-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      {genre.genre}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Este es uno de tus géneros más vistos. Explora más títulos similares.
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {coleccion
                        .filter(item => item.genero?.includes(genre.genre))
                        .slice(0, 3)
                        .map((item, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs cursor-pointer">
                            {item.titulo}
                          </Badge>
                        ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}