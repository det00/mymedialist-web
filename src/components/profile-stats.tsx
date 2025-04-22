import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarRange, Film, Tv, BookOpen, Gamepad2, CheckCircle, Clock, ListTodo, Ban, Crown, Award, Star, Zap, TrendingUp } from "lucide-react";

// Componentes para gráficos
interface DonutChartData {
  name: string;
  value: number;
  color: string;
}

const DonutChart = ({ data, colors }: { data: DonutChartData[]; colors: string[] }) => {
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



const BarChart = ({ data, maxValue, valueKey = "value", labelKey = "label", colorKey = "color" }) => {
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
                className="h-full rounded-full transition-all duration-500 ease-in-out"
                style={{ width: `${percent}%`, backgroundColor: item[colorKey] }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Definición de la interfaz para los datos del perfil
interface ProfileStats {
  totalContent: number;
  completed: number;
  inProgress: number;
  planned: number;
  dropped: number;
  movies: number;
  series: number;
  books: number;
  games: number;
}

interface ProfileData {
  id: string;
  name: string;
  username: string;
  bio: string;
  joinDate: string;
  email: string;
  avatar: string;
  stats: ProfileStats;
  isCurrentUser: boolean;
}

interface ProfileStatsProps {
  profileData: ProfileData;
}

// Datos simulados adicionales
const mockMonthlyStats = [
  { month: 'Ene', count: 5 },
  { month: 'Feb', count: 8 },
  { month: 'Mar', count: 10 },
  { month: 'Abr', count: 7 },
  { month: 'May', count: 12 },
  { month: 'Jun', count: 9 },
  { month: 'Jul', count: 15 },
  { month: 'Ago', count: 11 },
  { month: 'Sep', count: 13 },
  { month: 'Oct', count: 8 },
  { month: 'Nov', count: 6 },
  { month: 'Dic', count: 10 },
];

const mockGenreStats = [
  { genre: 'Drama', count: 18, color: '#6C5CE7' },
  { genre: 'Sci-Fi', count: 14, color: '#3B82F6' },
  { genre: 'Acción', count: 12, color: '#EF4444' },
  { genre: 'Comedia', count: 10, color: '#22C55E' },
  { genre: 'Fantasía', count: 8, color: '#F59E0B' },
  { genre: 'Thriller', count: 7, color: '#EC4899' },
  { genre: 'Romance', count: 5, color: '#FB7185' },
];

const mockAchievements = [
  {
    id: 'marathon',
    title: 'Maratonista',
    description: 'Ver 3 temporadas en 1 semana',
    icon: <Zap className="h-5 w-5" />,
    unlocked: true,
    date: '2025-02-15'
  },
  {
    id: 'bookworm',
    title: 'Ratón de biblioteca',
    description: 'Leer 10 libros',
    icon: <BookOpen className="h-5 w-5" />,
    unlocked: true,
    date: '2025-01-10'
  },
  {
    id: 'moviebuff',
    title: 'Cinéfilo',
    description: 'Ver 30 películas',
    icon: <Film className="h-5 w-5" />,
    unlocked: true,
    date: '2024-12-05'
  },
  {
    id: 'diverse',
    title: 'Diversificado',
    description: 'Tener al menos 5 ítems de cada tipo',
    icon: <TrendingUp className="h-5 w-5" />,
    unlocked: false,
    progress: 3,
    total: 4
  },
  {
    id: 'collector',
    title: 'Coleccionista',
    description: 'Tener 100 ítems en tu colección',
    icon: <Crown className="h-5 w-5" />,
    unlocked: false,
    progress: 87,
    total: 100
  }
];

export function ProfileStats({ profileData }: ProfileStatsProps) {
  const [activeTab, setActiveTab] = useState("general");
  
  // Preparar datos para el gráfico de donut
  const statusData = [
    { name: "Completados", value: profileData.stats.completed, color: "#22C55E" },
    { name: "En progreso", value: profileData.stats.inProgress, color: "#3B82F6" },
    { name: "Pendientes", value: profileData.stats.planned, color: "#FACC15" },
    { name: "Abandonados", value: profileData.stats.dropped, color: "#EF4444" }
  ];
  
  const statusColors = statusData.map(item => item.color);
  
  // Preparar datos para el gráfico de tipo de contenido
  const typeData = [
    { name: "Películas", value: profileData.stats.movies, color: "#8B5CF6" },
    { name: "Series", value: profileData.stats.series, color: "#EC4899" },
    { name: "Libros", value: profileData.stats.books, color: "#F59E0B" },
    { name: "Juegos", value: profileData.stats.games, color: "#10B981" }
  ];
  
  const typeColors = typeData.map(item => item.color);
  
  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="genres">Géneros</TabsTrigger>
          <TabsTrigger value="achievements">Logros</TabsTrigger>
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
                  <div className="text-3xl font-bold mb-2">{profileData.stats.totalContent}</div>
                  <div className="text-sm text-muted-foreground mb-6">Elementos totales</div>
                  
                  <div className="grid grid-cols-2 gap-6 w-full text-center">
                    <div className="flex flex-col items-center">
                      <div className="bg-muted p-3 rounded-full w-12 h-12 flex items-center justify-center mb-2">
                        <CheckCircle className="h-6 w-6 text-green-500" />
                      </div>
                      <div className="text-xl font-bold">{profileData.stats.completed}</div>
                      <div className="text-xs text-muted-foreground">Completados</div>
                    </div>
                    
                    <div className="flex flex-col items-center">
                      <div className="bg-muted p-3 rounded-full w-12 h-12 flex items-center justify-center mb-2">
                        <Clock className="h-6 w-6 text-blue-500" />
                      </div>
                      <div className="text-xl font-bold">{profileData.stats.inProgress}</div>
                      <div className="text-xs text-muted-foreground">En progreso</div>
                    </div>
                    
                    <div className="flex flex-col items-center">
                      <div className="bg-muted p-3 rounded-full w-12 h-12 flex items-center justify-center mb-2">
                        <ListTodo className="h-6 w-6 text-yellow-500" />
                      </div>
                      <div className="text-xl font-bold">{profileData.stats.planned}</div>
                      <div className="text-xs text-muted-foreground">Pendientes</div>
                    </div>
                    
                    <div className="flex flex-col items-center">
                      <div className="bg-muted p-3 rounded-full w-12 h-12 flex items-center justify-center mb-2">
                        <Ban className="h-6 w-6 text-red-500" />
                      </div>
                      <div className="text-xl font-bold">{profileData.stats.dropped}</div>
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
                      <span className="text-sm">{item.name}</span>
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
                  {mockMonthlyStats.map((month, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div 
                        className="w-6 rounded-t-sm bg-primary transition-all hover:bg-primary/80"
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
                data={mockGenreStats}
                maxValue={20}
                valueKey="count"
                labelKey="genre"
                colorKey="color"
              />
            </CardContent>
            <CardFooter>
              <div className="flex justify-between w-full text-sm text-muted-foreground">
                <span>Basado en {profileData.stats.totalContent} elementos</span>
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
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Film className="h-4 w-4 text-primary" />
                    <h3 className="font-medium">Películas</h3>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    <Badge className="bg-[#6C5CE7]">Drama (6)</Badge>
                    <Badge className="bg-[#3B82F6]">Sci-Fi (5)</Badge>
                    <Badge className="bg-[#EF4444]">Acción (4)</Badge>
                    <Badge className="bg-[#22C55E]">Comedia (3)</Badge>
                    <Badge className="bg-[#F59E0B]">Fantasía (2)</Badge>
                  </div>
                </div>
                
                {/* Series */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Tv className="h-4 w-4 text-primary" />
                    <h3 className="font-medium">Series</h3>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    <Badge className="bg-[#6C5CE7]">Drama (8)</Badge>
                    <Badge className="bg-[#EC4899]">Thriller (5)</Badge>
                    <Badge className="bg-[#22C55E]">Comedia (5)</Badge>
                    <Badge className="bg-[#3B82F6]">Sci-Fi (4)</Badge>
                    <Badge className="bg-[#FB7185]">Romance (2)</Badge>
                  </div>
                </div>
                
                {/* Libros */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <h3 className="font-medium">Libros</h3>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    <Badge className="bg-[#F59E0B]">Fantasía (5)</Badge>
                    <Badge className="bg-[#6C5CE7]">Drama (4)</Badge>
                    <Badge className="bg-[#3B82F6]">Sci-Fi (3)</Badge>
                    <Badge className="bg-[#FB7185]">Romance (2)</Badge>
                    <Badge className="bg-[#22C55E]">Aventura (1)</Badge>
                  </div>
                </div>
                
                {/* Juegos */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Gamepad2 className="h-4 w-4 text-primary" />
                    <h3 className="font-medium">Juegos</h3>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    <Badge className="bg-[#EF4444]">Acción (5)</Badge>
                    <Badge className="bg-[#F59E0B]">RPG (3)</Badge>
                    <Badge className="bg-[#3B82F6]">Estrategia (2)</Badge>
                    <Badge className="bg-[#22C55E]">Aventura (2)</Badge>
                  </div>
                </div>
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
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium flex items-center gap-2 mb-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    Thriller psicológico
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Basado en tu interés por thrillers y dramas, especialmente en series.
                  </p>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline" className="text-xs">Black Mirror</Badge>
                    <Badge variant="outline" className="text-xs">Mr. Robot</Badge>
                    <Badge variant="outline" className="text-xs">Dark</Badge>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium flex items-center gap-2 mb-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    Fantasía histórica
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Combina tu amor por la fantasía con elementos históricos.
                  </p>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline" className="text-xs">El nombre del viento</Badge>
                    <Badge variant="outline" className="text-xs">Juego de Tronos</Badge>
                    <Badge variant="outline" className="text-xs">The Witcher</Badge>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium flex items-center gap-2 mb-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    Ciencia ficción social
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Explora temas sociales a través de la ciencia ficción.
                  </p>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline" className="text-xs">The Expanse</Badge>
                    <Badge variant="outline" className="text-xs">Estación Once</Badge>
                    <Badge variant="outline" className="text-xs">Arrival</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Pestaña de logros */}
        {/* <TabsContent value="achievements" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Logros y recompensas</CardTitle>
              <CardDescription>
                Progreso y desbloqueos por tu actividad
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockAchievements.map(achievement => (
                  <div 
                    key={achievement.id} 
                    className={`p-4 border rounded-lg transition-all ${achievement.unlocked ? 'bg-muted/30' : 'bg-muted/10'}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-full ${achievement.unlocked ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">{achievement.title}</h3>
                          {achievement.unlocked && (
                            <Badge variant="outline" className="bg-primary/20 border-primary/30 text-primary">
                              <Award className="h-3 w-3 mr-1" />
                              Desbloqueado
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{achievement.description}</p>
                        
                        {achievement.unlocked ? (
                          <p className="text-xs text-muted-foreground mt-2">
                            Desbloqueado el {new Date(achievement.date).toLocaleDateString()}
                          </p>
                        ) : (
                          <div className="mt-2">
                            <div className="flex justify-between text-xs text-muted-foreground mb-1">
                              <span>Progreso</span>
                              <span>{achievement.progress}/{achievement.total}</span>
                            </div>
                            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary/50 rounded-full"
                                style={{ width: `${(achievement.progress / achievement.total) * 100}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Ver todos los logros
              </Button>
            </CardFooter>
          </Card>
        </TabsContent> */}
      </Tabs>
    </div>
  );
}