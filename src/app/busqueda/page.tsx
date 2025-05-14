"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { searchService } from "@/lib/search";
import moment from "moment";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Search, AlertCircle } from "lucide-react";
import { authService } from "@/lib/auth";
import { AuthModal } from "@/components/ui/auth-modal";
import { CardBuscar } from "@/lib/types";
import CardSearch from "@/components/CardSearch";

export default function Busqueda() {
  const searchParams = useSearchParams();
  const [resultados, setResultados] = useState<CardBuscar[]>([]);
  const [rutaTipo, setRutaTipo] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);

  // Paginación
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const ITEMS_PER_PAGE = 9;

  moment.locale("es");

  const tipoAMapeo: Record<string, string> = {
    V: "videojuego",
    P: "pelicula",
    L: "libro",
    S: "serie",
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
    window.scrollTo({ top: 0, behavior: "smooth" });
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
          rawTipo === "V" ||
          rawTipo === "P" ||
          rawTipo === "L" ||
          rawTipo === "S"
            ? rawTipo
            : "P";

        // Ya no usamos setTipo porque eliminamos la variable tipo
        setRutaTipo(tipoAMapeo[tipoValido]);
        setCurrentPage(1); // Reiniciar a la primera página con nueva búsqueda

        // Llamar al servicio de búsqueda
        const resultadosBusqueda = await searchService.searchContent(
          busqueda,
          tipoValido
        );

        // Asegurarse de que los resultados tengan el tipo correcto
        const resultadosConTipo = resultadosBusqueda.map((item: CardBuscar) => ({
          ...item,
          tipo: tipoValido, // Añadir el tipo a cada resultado
        }));

        setResultados(resultadosConTipo);
        setTotalPages(Math.ceil(resultadosConTipo.length / ITEMS_PER_PAGE));
      } catch (error) {
        console.error("Error al realizar la búsqueda:", error);
        setError("No se pudieron cargar los resultados. Inténtalo de nuevo.");
      } finally {
        setLoading(false);
      }
    };

    realizarBusqueda();
  }, [searchParams, isAuthenticated, tipoAMapeo]); // Añadimos tipoAMapeo como dependencia

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
      <div className="flex justify-center sm:justify-end items-center gap-1 sm:gap-2 flex-wrap">
        <Button
          variant="outline"
          size="icon"
          onClick={() => cambiarPagina(currentPage - 1)}
          disabled={currentPage === 1}
          className="h-8 w-8 cursor-pointer"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {paginasMostradas.map((pagina, index) =>
          pagina === "..." ? (
            <span key={`ellipsis-${index}`} className="px-2">
              ...
            </span>
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
        )}

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

  // Si el usuario no está autenticado, mostrar mensaje para iniciar sesión
  if (!isAuthenticated && !loading) {
    return (
      <div className="min-h-screen flex flex-col px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24 max-w-[1400px] mx-auto">
        <Card className="mt-4 sm:mt-6 md:mt-8 mb-8 sm:mb-12 shadow-md p-0 w-full">
          <CardContent className="p-4 sm:p-6 md:p-8 lg:p-10">
            <div className="flex flex-col items-center justify-center h-48 sm:h-64 text-center px-4">
              <AlertCircle className="h-10 w-10 sm:h-16 sm:w-16 text-muted-foreground mb-3 sm:mb-4" />
              <h2 className="text-lg sm:text-xl font-semibold mb-2">
                Necesitas iniciar sesión
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
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
    <div className="min-h-screen flex flex-col px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24 max-w-[1400px] mx-auto">
      <Card className="mt-4 sm:mt-6 md:mt-8 mb-8 sm:mb-12 shadow-md p-0 w-full">
        <CardContent className="p-4 sm:p-6 md:p-8 lg:p-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <h1 className="text-xl sm:text-2xl font-semibold line-clamp-2 mb-4 sm:mb-0">
              Resultados de búsqueda{" "}
              {searchParams.get("busqueda") &&
                `para "${searchParams.get("busqueda")}"`}
            </h1>
            
            {/* Paginación en la parte superior */}
            {!loading && !error && resultados.length > 0 && (
              <div className="self-end sm:self-auto">
                {renderPaginacion()}
              </div>
            )}
          </div>

          {/* Contenedor principal */}
          <div>
            {loading ? (
              <div className="flex items-center justify-center h-[300px] sm:h-[400px] md:h-[500px]">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-t-2 border-primary mx-auto mb-3 sm:mb-4"></div>
                  <div className="text-sm sm:text-base">Cargando resultados...</div>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-[300px] sm:h-[400px] md:h-[500px]">
                <div className="text-center text-red-500 px-4">
                  <AlertCircle className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-3 sm:mb-4" />
                  <div className="text-sm sm:text-base">{error}</div>
                </div>
              </div>
            ) : resultados.length === 0 ? (
              <div className="flex items-center justify-center h-[300px] sm:h-[400px] md:h-[500px]">
                <div className="text-center px-4">
                  <Search className="h-10 w-10 sm:h-16 sm:w-16 text-muted-foreground mx-auto mb-3 sm:mb-4" />
                  <div className="text-base sm:text-lg mb-2">
                    No se encontraron resultados para tu búsqueda
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Intenta con otro término o cambia el tipo de contenido
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                  {resultadosPaginados.map((item) => (
                    <Link
                      href={`/${rutaTipo}/${item.id_api}`}
                      key={`${item.id_api}-${item.tipo}`}
                      className="block"
                    >
                      <CardSearch
                        id={item.item?.id ?? -1}
                        id_api={item.id_api}
                        tipo={item.tipo}
                        titulo={item.titulo}
                        estado={item.item?.estado ?? ""}
                        autor={item.autor}
                        genero={item.genero}
                        imagen={item.imagen}
                      />
                    </Link>
                  ))}
                </div>
                
                {/* Paginación inferior (solo en móviles) */}
                <div className="mt-8 sm:hidden py-2">
                  {renderPaginacion()}
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Modal de autenticación */}
      <AuthModal
        showModal={showAuthModal}
        setShowModal={setShowAuthModal}
        initialView="login"
      />
    </div>
  );
}