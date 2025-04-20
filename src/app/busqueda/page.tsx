"use client";

import { useState, useEffect } from "react";
import { CardSearch } from "@/components/CardSearch";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { searchService, SearchResult } from "@/lib/search";
import moment from "moment";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Search, AlertCircle } from "lucide-react";
import { authService } from "@/lib/auth";
import { AuthModal } from "@/components/ui/auth-modal";

export default function Busqueda() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [resultados, setResultados] = useState<SearchResult[]>([]);
  const [rutaTipo, setRutaTipo] = useState<string>("");
  const [tipo, setTipo] = useState<string>("P");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  
  // Paginación
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const ITEMS_PER_PAGE = 9; // 9 items por página (3 filas de 3 columnas)
  
  moment.locale("es");

  const tipoAMapeo: Record<string, string> = {
    V: "videojuego",
    P: "pelicula",
    L: "libro",
    S: "serie",
  };

  const tipoCompleto: Record<string, string> = {
    V: "Videojuegos",
    P: "Películas",
    L: "Libros",
    S: "Series",
  };

  // Función para cambiar el tipo de contenido
  const cambiarTipo = (nuevoTipo: string) => {
    const currentBusqueda = searchParams.get("busqueda") || "";
    const url = `/busqueda?busqueda=${encodeURIComponent(currentBusqueda)}&tipo=${nuevoTipo}`;
    router.push(url);
  };

  // Obtener los resultados para la página actual
  const resultadosPaginados = resultados.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Cambiar de página
  const cambiarPagina = (pagina: number) => {
    if (pagina < 1 || pagina > totalPages) return;
    setCurrentPage(pagina);
    
    // Scroll suave hacia arriba
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Verificar autenticación
  useEffect(() => {
    setIsAuthenticated(authService.isAuthenticated());
  }, []);

  useEffect(() => {
    const realizarBusqueda = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Verificar autenticación
        if (!isAuthenticated) {
          setError("Necesitas iniciar sesión para buscar contenido");
          setLoading(false);
          return;
        }
        
        const busqueda = searchParams.get("busqueda") || "";
        const rawTipo = searchParams.get("tipo");
        
        // Validar el tipo de búsqueda
        const tipoValido =
          rawTipo === "V" || rawTipo === "P" || rawTipo === "L" || rawTipo === "S"
            ? rawTipo
            : "P";
        
        setTipo(tipoValido);
        setRutaTipo(tipoAMapeo[tipoValido]);
        setCurrentPage(1); // Reiniciar a la primera página con nueva búsqueda
        
        console.log("Realizando búsqueda:", {
          busqueda,
          tipo: tipoValido,
          rutaTipo: tipoAMapeo[tipoValido]
        });
        
        // Llamar al servicio de búsqueda
        const resultadosBusqueda = await searchService.searchContent(busqueda, tipoValido);
        
        // Asegurarse de que los resultados tengan el tipo correcto
        const resultadosConTipo = resultadosBusqueda.map((item: SearchResult) => ({
          ...item,
          tipo: tipoValido // Añadir el tipo a cada resultado
        }));
        
        setResultados(resultadosConTipo);
        setTotalPages(Math.ceil(resultadosConTipo.length / ITEMS_PER_PAGE));
        console.log("Resultados de búsqueda:", resultadosConTipo);
      } catch (error) {
        console.error("Error al realizar la búsqueda:", error);
        setError("No se pudieron cargar los resultados. Inténtalo de nuevo.");
      } finally {
        setLoading(false);
      }
    };
    
    realizarBusqueda();
  }, [searchParams, isAuthenticated]); // Dependencias actualizadas

  // Renderizar paginación
  const renderPaginacion = () => {
    if (totalPages <= 1) return null;
    
    const paginasMostradas = [];
    
    // Siempre mostrar primera página
    paginasMostradas.push(1);
    
    // Calcular rango central
    let inicio = Math.max(2, currentPage - 1);
    let fin = Math.min(totalPages - 1, currentPage + 1);
    
    // Asegurar que mostramos 3 páginas en el centro si es posible
    if (fin - inicio < 2 && totalPages > 3) {
      if (inicio === 2) {
        fin = Math.min(totalPages - 1, inicio + 2);
      } else if (fin === totalPages - 1) {
        inicio = Math.max(2, fin - 2);
      }
    }
    
    // Agregar elipsis después de la primera página si es necesario
    if (inicio > 2) {
      paginasMostradas.push("...");
    }
    
    // Agregar páginas del rango central
    for (let i = inicio; i <= fin; i++) {
      paginasMostradas.push(i);
    }
    
    // Agregar elipsis antes de la última página si es necesario
    if (fin < totalPages - 1) {
      paginasMostradas.push("...");
    }
    
    // Siempre mostrar última página si hay más de una
    if (totalPages > 1) {
      paginasMostradas.push(totalPages);
    }
    
    return (
      <div className="flex justify-center items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => cambiarPagina(currentPage - 1)}
          disabled={currentPage === 1}
          className="h-8 w-8 cursor-pointer"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        {paginasMostradas.map((pagina, index) => (
          pagina === "..." ? (
            <span key={`ellipsis-${index}`} className="px-2">...</span>
          ) : (
            <Button
              key={`page-${pagina}`}
              variant={currentPage === Number(pagina) ? "default" : "outline"}
              size="sm"
              onClick={() => cambiarPagina(Number(pagina))}
              className="h-8 w-8 cursor-pointer"
            >
              {pagina}
            </Button>
          )
        ))}
        
        <Button
          variant="outline"
          size="icon"
          onClick={() => cambiarPagina(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="h-8 w-8 cursor-pointer"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  // Renderizar grid de resultados
  const renderResultados = () => {
    // Crear placecard para mostrar cuando no hay suficientes elementos
    const renderPlaceholder = (index: number) => (
      <div key={`placeholder-${index}`} className="opacity-0 h-[136px]">
        {/* La altura debe coincidir con la altura de CardSearch */}
        <div className="border rounded-md p-4 h-full"></div>
      </div>
    );
    
    // Calcular cuántos placeholders necesitamos
    const placeholdersNeeded = Math.max(0, ITEMS_PER_PAGE - resultadosPaginados.length);
    
    // Crear array de placeholders
    const placeholders = Array.from({ length: placeholdersNeeded }, (_, i) => 
      renderPlaceholder(i)
    );
    
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {resultadosPaginados.map((item) => (
          <Link 
            href={`/${rutaTipo}/${item.id_api}`} 
            key={`${item.id_api}-${rutaTipo}`}
            className="block"
          >
            <CardSearch item={item} />
          </Link>
        ))}
        {placeholders}
      </div>
    );
  };

  // Mostrar modal de autenticación si no está autenticado
  if (!isAuthenticated && !loading) {
    return (
      <div className="min-h-screen flex flex-col px-8 sm:px-12 md:px-24 lg:px-32">
        <Card className="mt-8 mb-12 shadow-md p-0">
          <CardContent className="p-6 sm:p-10">
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <AlertCircle className="h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">Necesitas iniciar sesión</h2>
              <p className="text-muted-foreground mb-6">
                Para buscar y explorar contenido, primero debes iniciar sesión
              </p>
              <Button onClick={() => setShowAuthModal(true)}>
                Iniciar sesión
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <AuthModal
          showModal={showAuthModal}
          setShowModal={setShowAuthModal}
          initialView="login"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col px-8 sm:px-12 md:px-24 lg:px-32">
      <Card className="mt-8 mb-12 shadow-md p-0">
        <CardContent className="p-6 sm:p-10">
          <h1 className="text-2xl font-semibold mb-6">
            Resultados de búsqueda {searchParams.get("busqueda") && `para "${searchParams.get("busqueda")}"`}
          </h1>
          
          {/* Filtros de tipo */}
          <div className="flex flex-wrap gap-2 mb-6">
            {(Object.keys(tipoAMapeo) as Array<string>).map((tipoKey) => (
              <Button
                key={tipoKey}
                variant={tipo === tipoKey ? "default" : "outline"}
                onClick={() => cambiarTipo(tipoKey)}
                className="rounded-full cursor-pointer"
              >
                {tipoCompleto[tipoKey]}
              </Button>
            ))}
          </div>
          
          {/* Contenedor principal con altura fija y posicionamiento relativo */}
          <div className="relative min-h-[600px]">
            {loading ? (
              <div className="flex items-center justify-center h-[540px]">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary mx-auto mb-4"></div>
                  <div>Cargando resultados...</div>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-[540px]">
                <div className="text-center text-red-500">
                  <AlertCircle className="h-8 w-8 mx-auto mb-4" />
                  <div>{error}</div>
                </div>
              </div>
            ) : resultados.length === 0 ? (
              <div className="flex items-center justify-center h-[540px]">
                <div className="text-center">
                  <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <div className="text-lg mb-2">No se encontraron resultados para tu búsqueda</div>
                  <p className="text-muted-foreground">Intenta con otro término o cambia el tipo de contenido</p>
                </div>
              </div>
            ) : (
              <>
                {/* Altura reducida para dejar espacio a la paginación */}
                <div className="mb-16">
                  {renderResultados()}
                </div>
                
                {/* Paginación con posición absoluta en la parte inferior */}
                <div className="absolute bottom-0 left-0 right-0 py-4">
                  {renderPaginacion()}
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}