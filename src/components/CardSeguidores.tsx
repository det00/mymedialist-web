import Link from "next/link";
import {UserAvatar} from "@/components/UserAvatar";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {BookOpenIcon, FilmIcon, Gamepad2Icon, TvIcon, UserMinus} from "lucide-react";
import React from "react";
import {Seguidor} from "@/lib/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { profileService } from "@/lib/profile";

interface CardSeguidoresProp {
  seguidoresOrdenados: Seguidor[];
}

const CardSeguidores = ({seguidoresOrdenados}: CardSeguidoresProp) => {
  const queryClient = useQueryClient();

  const dejarSeguirMutation = useMutation({
    mutationFn: (idSeguido: number) => profileService.toggleFollow(idSeguido.toString()),
    onSuccess: () => {
      // Invalidar y refrescar consultas relevantes
      queryClient.invalidateQueries({ queryKey: ["seguidos"] });
      queryClient.invalidateQueries({ queryKey: ["seguidores"] });
      queryClient.invalidateQueries({ queryKey: ["perfil"] });
    },
  });

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case "movie":
        return <FilmIcon className="h-4 w-4"/>;
      case "series":
        return <TvIcon className="h-4 w-4"/>;
      case "book":
        return <BookOpenIcon className="h-4 w-4"/>;
      case "game":
        return <Gamepad2Icon className="h-4 w-4"/>;
      default:
        return <FilmIcon className="h-4 w-4"/>;
    }
  };
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 60) {
      return `Hace ${diffMinutes} ${diffMinutes === 1 ? "minuto" : "minutos"}`;
    } else if (diffHours < 24) {
      return `Hace ${diffHours} ${diffHours === 1 ? "hora" : "horas"}`;
    } else if (diffDays < 7) {
      return `Hace ${diffDays} ${diffDays === 1 ? "día" : "días"}`;
    } else {
      return date.toLocaleDateString();
    }
  };
  return <>
    {seguidoresOrdenados.length > 0 ? (
      <div className="space-y-3">
        {seguidoresOrdenados.map((friend) => (
          <Link href={`/perfil/${friend.id}`} key={friend.id}>
            <div
              className="border rounded-lg p-4 hover:border-primary transition-colors cursor-pointer space-y-3 mb-4">
              <div className="flex items-start gap-4">
                {/* Avatar e información básica */}
                <div className="relative">
                  <UserAvatar avatarData={friend.avatar} size="lg"/>
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">{friend.nombre}</h3>
                      <p className="text-sm text-muted-foreground">
                        @{friend.username}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        dejarSeguirMutation.mutate(friend.id);
                      }}
                    >
                      <UserMinus className="h-4 w-4 mr-2" />
                      Dejar de seguir
                    </Button>
                  </div>

                  {/* Información adicional */}
                  <div className="mt-2 space-y-2">
                    {/* Actividad reciente */}
                    {friend.ultimaActividad && (
                      <div className="text-sm">
                                  <span className="text-muted-foreground">
                                    Actividad reciente:{" "}
                                  </span>
                        <span className="flex items-center gap-1">
                                    {getContentTypeIcon(
                                      friend.ultimaActividad.tipo
                                    )}
                          <span>{friend.ultimaActividad.titulo}</span>
                          <Badge
                            variant="outline"
                            className="text-xs ml-2"
                          >
            {formatRelativeTime(
              friend.ultimaActividad.fecha
            )}
                                    </Badge>
                                  </span>
                      </div>
                    )}

                    {/* Etiquetas adicionales */}
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">
                        {friend.contenidosTotales} contenidos
                      </Badge>
                      <Badge variant="outline">
                        {friend.contenidosCompartidos} coincidencias
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    ) : "Aún no sigues a nadie"}</>
}
export default CardSeguidores