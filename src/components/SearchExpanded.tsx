"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Film, Tv, BookOpen, Gamepad2, X, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import CardSearch from "@/components/CardSearch";
import { searchService } from "@/lib/search";
import { CardBuscar } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";

interface SearchExpandedProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
  initialType?: string;
  sourceRect?: DOMRect | null;
}

export function SearchExpanded({
  isOpen,
  onClose,
  initialQuery = "",
  initialType = "P",
  sourceRect = null,
}: SearchExpandedProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [busqueda, setBusqueda] = useState<string>(initialQuery);
  const [tipo, setTipo] = useState<string>(initialType);
  const [resultados, setResultados] = useState<CardBuscar[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [showAllResults, setShowAllResults] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Paginación
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const ITEMS_PER_PAGE = 9; // 9 items por página (3 filas de 3 columnas)

  // Tipos de contenido con sus iconos
  const tiposContenido = [
    { id: "P", nombre: "Películas", icon: Film },
    { id: "S", nombre: "Series", icon: Tv },
    { id: "L", nombre: "Libros", icon: BookOpen },
    { id: "V", nombre: "Videojuegos", icon: Gamepad2 },
  ];

  // Enfocar el input cuando se abre
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isOpen]);

  // Calcular resultados paginados
  const resultadosPaginados = useCallback(() => {
    if (!showAllResults) {
      // Si no estamos mostrando todos los resultados, mostrar solo los primeros 6
      return resultados.slice(0, 6);
    } else {
      // Si estamos mostrando todos, usar paginación
      return resultados.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
      );
    }
  }, [resultados, currentPage, ITEMS_PER_PAGE, showAllResults]);

  // Actualizar búsqueda desde parámetros de URL
  useEffect(() => {
    if (isOpen) {
      const queryParam = searchParams.get("busqueda");
      const typeParam = searchParams.get("tipo");
      
      if (queryParam) {
        setBusqueda(queryParam);
        setHasSearched(true);
        
        if (typeParam && ["P", "S", "L", "V"].includes(typeParam)) {
          setTipo(typeParam);
        }
        
        // Realizar búsqueda automáticamente
        handleSearch(queryParam, typeParam || tipo);
      }
    }
  }, [isOpen, searchParams]);
  
  // Cambiar de página
  const cambiarPagina = (pagina: number) => {
    if (pagina < 1 || pagina > totalPages) return;
    setCurrentPage(pagina);
  };

  // Manejar tecla Enter
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && busqueda.trim()) {
      event.preventDefault();
      handleSearch(busqueda, tipo);
    } else if (event.key === "Escape") {
      onClose();
    }
  };

  // Realizar búsqueda
  const handleSearch = async (query: string, contentType: string) => {
    if (!query.trim()) return;
    
    setLoading(true);
    setHasSearched(true);
    setShowAllResults(false); // Resetear a vista previa al hacer nueva búsqueda
    setCurrentPage(1); // Resetear a primera página
    
    try {
      const results = await searchService.searchContent(query, contentType);
      
      // Añadir tipo a cada resultado
      const resultsWithType = results.map((item: CardBuscar) => ({
        ...item,
        tipo: contentType,
      }));
      
      setResultados(resultsWithType);
      setTotalPages(Math.ceil(resultsWithType.length / ITEMS_PER_PAGE));
      
      // Actualizar URL sin recargar la página
      const newUrl = `/busqueda?busqueda=${encodeURIComponent(query)}&tipo=${contentType}`;
      window.history.pushState({ path: newUrl }, '', newUrl);
    } catch (error) {
      console.error("Error en búsqueda:", error);
      setResultados([]);
    } finally {
      setLoading(false);
    }
  };

  // Cambiar tipo de contenido
  const handleTipoChange = (nuevoTipo: string) => {
    setTipo(nuevoTipo);
    if (hasSearched && busqueda.trim()) {
      handleSearch(busqueda, nuevoTipo);
    }
  };

  // Calcular los estilos iniciales para la animación
  const getSearchBarStyles = () => {
    if (!sourceRect) return {};
    
    return {
      position: 'fixed' as const,
      top: sourceRect.top,
      left: sourceRect.left,
      width: sourceRect.width,
      height: sourceRect.height,
      borderRadius: '1rem',
      zIndex: 50,
    };
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="container mx-auto px-4 py-4 max-w-6xl">
            {/* Barra de búsqueda expandida */}
            <motion.div
              className="relative mb-6"
              initial={sourceRect ? { opacity: 0 } : { y: -20, opacity: 0 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.3,
                ease: 'easeInOut',
              }}
              style={sourceRect ? {
                ...getSearchBarStyles(),
                transition: 'all 0.3s ease-in-out',
                ...(isOpen && {
                  position: 'relative',
                  top: 'auto',
                  left: 'auto',
                  width: '100%',
                  height: 'auto',
                  borderRadius: '9999px',
                  transitionDelay: '0.1s'
                })
              } : {}}
            >
              <div className="flex items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                  <Input
                    ref={inputRef}
                    type="text"
                    placeholder="Buscar series, pelis, libros..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="rounded-full pl-12 pr-4 py-6 text-lg border-2 focus-visible:ring-primary"
                  />
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={onClose}
                  className="ml-2 h-10 w-10"
                  aria-label="Cerrar búsqueda"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              {/* Filtros de tipo */}
              <div className="flex flex-wrap gap-2 mt-4">
                {tiposContenido.map((tipoItem) => (
                  <Button
                    key={tipoItem.id}
                    variant={tipo === tipoItem.id ? "default" : "outline"}
                    onClick={() => handleTipoChange(tipoItem.id)}
                    className="rounded-full cursor-pointer"
                    size="sm"
                  >
                    <tipoItem.icon className="h-4 w-4 mr-2" />
                    {tipoItem.nombre}
                  </Button>
                ))}
              </div>
            </motion.div>

              {/* Resultados de búsqueda */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
                </div>
              ) : hasSearched ? (
                resultados.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {resultadosPaginados().map((item) => (
                        <Link
                          href={`/${
                            item.tipo === "P"
                              ? "pelicula"
                              : item.tipo === "S"
                              ? "serie"
                              : item.tipo === "L"
                              ? "libro"
                              : "videojuego"
                          }/${item.id_api}`}
                          key={`${item.id_api}-${item.tipo}`}
                          className="block"
                          onClick={onClose}
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
                    
                    {/* Paginación (solo cuando se muestran todos los resultados) */}
                    {showAllResults && totalPages > 1 && (
                      <div className="flex justify-center items-center gap-2 mt-6">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => cambiarPagina(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="h-8 w-8"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        
                        <span className="text-sm">
                          Página {currentPage} de {totalPages}
                        </span>
                        
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => cambiarPagina(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="h-8 w-8"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12">
                    <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg">No se encontraron resultados para tu búsqueda</p>
                    <p className="text-muted-foreground">Intenta con otro término o cambia el tipo de contenido</p>
                  </div>
                )
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Escribe algo para buscar</p>
                </div>
              )}
              
              {/* Botón para ver todos los resultados */}
              {hasSearched && resultados.length > 6 && !showAllResults && (
                <div className="text-center mt-8">
                  <Button
                    onClick={() => {
                      setShowAllResults(true);
                      setCurrentPage(1);
                    }}
                    className="rounded-full"
                  >
                    Ver todos los resultados ({resultados.length})
                  </Button>
                </div>
              )}
              
              {/* Botón para volver a vista previa */}
              {hasSearched && showAllResults && (
                <div className="text-center mt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowAllResults(false);
                      setCurrentPage(1);
                    }}
                    className="rounded-full text-sm"
                    size="sm"
                  >
                    Volver a vista previa
                  </Button>
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
