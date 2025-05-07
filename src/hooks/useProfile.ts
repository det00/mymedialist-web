// src/hooks/useProfile.ts
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {useRouter} from "next/navigation";
import {profileService} from "@/lib/profile";
import {authService} from "@/lib/auth";
import {Perfil, Seguidor} from "@/lib/types";
import amigosService from "@/lib/amigos";

export interface PutPerfilRequest {
  name: string;
  bio: string;
  avatar_id: string;
}

export function useProfile(idUsuario: number) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [previewMode, setPreviewMode] = useState<boolean>(false);

  // Obtener datos de perfil
  const { data: datosPerfil, isLoading: loadingPerfil, error: errorPerfil } = useQuery({
    queryKey: ["perfil", idUsuario],
    queryFn: () => profileService.getPerfil(idUsuario),
    enabled: idUsuario !== -1,
  });

  // Obtener seguidos
  const { data: seguidos = [], isLoading: loadingSeguidos } = useQuery({
    queryKey: ["seguidos", idUsuario],
    queryFn: () => amigosService.getSeguidos(idUsuario),
    enabled: idUsuario !== -1,
  });

  // Obtener seguidores
  const { data: seguidores = [], isLoading: loadingSeguidores } = useQuery({
    queryKey: ["seguidores", idUsuario],
    queryFn: () => amigosService.getSeguidores(idUsuario),
    enabled: idUsuario !== -1,
  });

  const deleteAccount = async () => {
    try {
      await authService.deleteAccount();
      router.push("/");
    } catch (err) {
      console.error("Error al eliminar la cuenta:", err);
      throw new Error("No se pudo eliminar la cuenta");
    }
  };
  // Guardar cambios del perfil
  const saveProfile = async (updatedData: Partial<PutPerfilRequest>) => {
    try {
      await profileService.updateProfile(updatedData);

      // Actualizar también el avatar en localStorage para que se refleje en la navbar
      if (updatedData.avatar_id) {
        authService.setUserAvatar(updatedData.avatar_id);
      }

      setIsEditMode(false);
      
      // Invalidar caché para forzar recarga
      queryClient.invalidateQueries({ queryKey: ["perfil"] });
      
      // Disparar eventos para forzar la actualización de componentes
      window.dispatchEvent(new Event("userDataUpdated"));
      window.dispatchEvent(new Event("avatarUpdated"));

      return true;
    } catch (err) {
      console.error("Error al guardar cambios del perfil:", err);
      return false;
    }
  };

  // Manejar seguir/dejar de seguir
  const toggleFollowMutation = useMutation({
    mutationFn: (perfilId: string) => profileService.toggleFollow(perfilId),
    onSuccess: (response) => {
      // Invalidar y refrescar consultas relevantes
      queryClient.invalidateQueries({ queryKey: ["seguidos"] });
      queryClient.invalidateQueries({ queryKey: ["seguidores"] });
      queryClient.invalidateQueries({ queryKey: ["perfil"] });
    },
  });

  const toggleFollow = async () => {
    try {
      if (!datosPerfil || datosPerfil.esMiPerfil) {
        return false;
      }

      await toggleFollowMutation.mutateAsync(datosPerfil.id);
      return true;
    } catch (err) {
      console.error("Error al seguir/dejar de seguir:", err);
      return false;
    }
  };

  // Manejar cierre de sesión
  const logout = () => {
    authService.logout();
    router.push("/");
  };

  // Toggle modo edición
  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
    // Si estamos en modo preview y activamos edición, desactivamos preview
    if (previewMode) {
      setPreviewMode(false);
    }
  };

  // Toggle modo preview
  const togglePreviewMode = () => {
    setPreviewMode(!previewMode);
    // Si estamos en modo edición y activamos preview, desactivamos edición
    if (isEditMode) {
      setIsEditMode(false);
    }
  };

  // Ya no es necesario, React Query maneja la carga de datos

  const refreshProfile = () => {
    queryClient.invalidateQueries({ queryKey: ["perfil", idUsuario] });
    queryClient.invalidateQueries({ queryKey: ["seguidos", idUsuario] });
    queryClient.invalidateQueries({ queryKey: ["seguidores", idUsuario] });
  };

  return {
    datosPerfil,
    seguidores,
    seguidos,
    loading: loadingPerfil || loadingSeguidos || loadingSeguidores,
    error: errorPerfil,
    isEditMode,
    previewMode,
    setDatosPerfil: (perfil) => queryClient.setQueryData(["perfil", idUsuario], perfil),
    saveProfile,
    toggleFollow,
    logout,
    toggleEditMode,
    togglePreviewMode,
    refreshProfile,
  };
}
