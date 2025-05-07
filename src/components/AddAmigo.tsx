"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "./ui/dialog";
import { DialogFooter, DialogHeader } from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Search, UserPlus, Check, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ScrollArea } from "./ui/scroll-area";
import amigosService from "@/lib/amigos";
import { Usuario } from "@/lib/types";

interface AddAmigoProps {
  cerrarAddAmigo: () => void;
  open: boolean;
}

export function AddAmigo({ cerrarAddAmigo, open }: AddAmigoProps) {
  const queryClient = useQueryClient();
  const [query, setQuery] = useState<string>("");
  const [searchTerm] = useState<string>("");

  // Buscar usuarios
  const { data: searchResults = [], isLoading: isSearching, refetch } = useQuery({
    queryKey: ["buscarUsuarios", query],
    queryFn: () => amigosService.buscarUsuarios(query),
    enabled: query.trim() !== "",
  });

  // Seguir/Dejar de seguir usuario
  const seguirUsuarioMutation = useMutation({
    mutationFn: amigosService.seguirUsuario,
    onSuccess: () => {
      // Invalidar y refrescar consultas relevantes
      queryClient.invalidateQueries({ queryKey: ["buscarUsuarios"] });
      queryClient.invalidateQueries({ queryKey: ["seguidores"] });
      queryClient.invalidateQueries({ queryKey: ["seguidos"] });
    },
  });

  const handleBuscarUsuarios = () => {
    if (query.trim()) {
      void refetch();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      buscarUsuarios();
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) cerrarAddAmigo();
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Buscar personas</DialogTitle>
        </DialogHeader>

        {/* Barra de búsqueda */}
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre o usuario"
              className="pl-8"
              value={query}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
            />
          </div>
          <Button
            onClick={handleBuscarUsuarios}
            disabled={isSearching || !query.trim()}
            className="cursor-pointer"
          >
            {isSearching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Buscar"
            )}
          </Button>
        </div>

        {/* Área de resultados */}
        <div className="mt-2">
          {isSearching ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-8 w-8 text-primary animate-spin mb-2" />
              <p className="text-sm text-muted-foreground">
                Buscando usuarios...
              </p>
            </div>
          ) : searchResults.length > 0 ? (
            <ScrollArea className="h-[300px] rounded-md border p-4">
              <div className="space-y-4">
                {searchResults.map((usuario) => (
                  <div
                    key={usuario.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        {usuario.avatar.startsWith("avatar") ? (
                          <AvatarImage
                            src={`/avatars/${usuario.avatar}.svg`}
                            alt={usuario.nombre}
                          />
                        ) : usuario.avatar.startsWith("initial_") ? (
                          <AvatarFallback
                            style={{
                              backgroundColor:
                                usuario.avatar.split("_")[1] || "#6C5CE7",
                            }}
                            className="text-white"
                          >
                            {usuario.avatar.split("_")[2] ||
                              usuario.nombre.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        ) : (
                          <AvatarFallback>
                            {usuario.nombre.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{usuario.nombre}</p>
                        <p className="text-xs text-muted-foreground">
                          @{usuario.username}
                        </p>
                      </div>
                    </div>

                    <Button
                      variant={usuario.siguiendo ? "outline" : "default"}
                      size="sm"
                      disabled={seguirUsuarioMutation.status === 'pending'}
                      onClick={() => seguirUsuarioMutation.mutate(usuario.id)}
                      className="cursor-pointer"
                    >
                      {usuario.siguiendo ? (
                        <>
                          <Check className="h-4 w-4 mr-1" />
                          Dejar de seguir
                        </>
                      ) : (
                        <>
                          <UserPlus className="h-4 w-4 mr-1" />
                          Seguir
                        </>
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          ) : searchTerm.trim() ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No se encontraron usuarios con ese término
              </p>
            </div>
          ) : (
            <div className="text-center py-8">
              <Search className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">
                Busca por nombre de usuario o correo electrónico
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Las solicitudes de amistad enviadas aparecerán como pendientes
                hasta que sean aceptadas.
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button
              variant="outline"
              onClick={cerrarAddAmigo}
              className="cursor-pointer"
            >
              Cerrar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
