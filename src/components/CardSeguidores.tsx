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
      return new Intl.DateTimeFormat('es-ES', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
      }).format(date);
    }
  };
  return <>
    {seguidoresOrdenados.length > 0 ? (
      <div className="space-y-6">
        {seguidoresOrdenados.map((friend, index) => (
          <React.Fragment key={`follower-${friend.id}-${index}`}>
            <Link href={`/perfil/${friend.id}`} key={friend.id}>
              <div className="border rounded-lg p-4 hover:border-primary transition-colors cursor-pointer flex items-center gap-4">
                <UserAvatar avatarData={friend.avatar} size="sm"/>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium truncate">{friend.nombre}</h3>
                    <p className="text-sm text-muted-foreground">
                      @{friend.username}
                    </p>
                  </div>
                  {friend.ultimaActividad && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      {getContentTypeIcon(friend.ultimaActividad.tipo)}
                      <span className="truncate">
                        {friend.ultimaActividad.titulo}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
            {index < seguidoresOrdenados.length - 1 && (
              <div className="border-t my-2"></div>
            )}
          </React.Fragment>
        ))}
      </div>
    ) : "Aún no sigues a nadie"}</>
}
export default CardSeguidores