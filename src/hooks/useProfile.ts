// src/hooks/useProfile.ts
import {useEffect, useState} from "react";
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
  const [datosPerfil, setDatosPerfil] = useState<Perfil | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [previewMode, setPreviewMode] = useState<boolean>(false);
  const [seguidos, setSeguidos] = useState<Seguidor[]>([]);
  const [seguidores, setSeguidores] = useState<Seguidor[]>([]);
  const router = useRouter();

  // Cargar datos del perfil
  const loadProfileData = async (idUsuario: number) => {
    setLoading(true);
    setError(null);

    try {
      const isAuthenticated = authService.isAuthenticated();
      if (!isAuthenticated) {
        router.push("/");
        return;
      }

      const perfil = await profileService.getPerfil(idUsuario);
      
      // Sincronizar el avatar del perfil con localStorage para consistencia
      if (perfil.esMiPerfil && (perfil.avatar_id || perfil.avatar)) {
        const currentAvatar = authService.getUserData()?.avatar;
        const profileAvatar = perfil.avatar_id || perfil.avatar;
        
        // Si hay diferencia entre los avatares, actualizar localStorage
        if (currentAvatar !== profileAvatar) {
          authService.setUserAvatar(profileAvatar);
        }
      }

      setDatosPerfil(perfil);
    } catch (err) {
      console.error("Error al cargar datos de perfil:", err);
      setError("No se pudieron cargar los datos del perfil");
    } finally {
      setLoading(false);
    }
  };

  const deleteAccount = async () => {
    try {
      setLoading(true);
      await authService.deleteAccount();
      router.push("/");
    } catch (err) {
      console.error("Error al eliminar la cuenta:", err);
      setError("No se pudo eliminar la cuenta");
    } finally {
      setLoading(false);
    }
  };

  // Cargar seguidores
  const getSeguidores = async (idUsuario: number) => {
    try {
      setLoading(true);
      const response = await amigosService.getSeguidores(idUsuario)
      setSeguidores(response)
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }

  }
  //Cargar seguidos
  const getSeguidos = async (idUsuario: number) => {
    setLoading(true);
    try {
      const response = await amigosService.getSeguidos(idUsuario);
      setSeguidos(response)
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }
  // Guardar cambios del perfil
  const saveProfile = async (updatedData: Partial<PutPerfilRequest>) => {
    try {
      if (!datosPerfil) {
        throw new Error("No hay datos de perfil para actualizar");
      }

      setDatosPerfil({
        ...datosPerfil,
        ...updatedData,
      });

      await profileService.updateProfile(updatedData);

      // Actualizar también el avatar en localStorage para que se refleje en la navbar
      if (updatedData.avatar_id) {
        authService.setUserAvatar(updatedData.avatar_id);
      }

      setIsEditMode(false);
      
      // Recargar los datos del perfil para garantizar la sincronización
      // de todos los componentes, especialmente para cambios de tipo de avatar
      setTimeout(() => {
        loadProfileData(idUsuario);
        
        // Disparar eventos para forzar la actualización de componentes
        window.dispatchEvent(new Event("userDataUpdated"));
        window.dispatchEvent(new Event("avatarUpdated"));
      }, 100);

      return true;
    } catch (err) {
      console.error("Error al guardar cambios del perfil:", err);
      return false;
    }
  };

  // Manejar seguir/dejar de seguir
  const toggleFollow = async () => {
    try {
      if (!datosPerfil || datosPerfil.esMiPerfil) {
        return false;
      }

      const response = await profileService.toggleFollow(datosPerfil.id);

      // Actualizar estado local
      setDatosPerfil({
        ...datosPerfil,
        siguiendo: response.siguiendo,
      });

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

  // Cargar datos al montar el componente
  useEffect(() => {
    if (idUsuario !== -1) {
      loadProfileData(idUsuario);
      getSeguidos(idUsuario);
      getSeguidores(idUsuario);
    }
  }, [idUsuario]);

  return {
    datosPerfil,
    seguidores,
    seguidos,
    loading,
    error,
    isEditMode,
    previewMode,
    setDatosPerfil,
    saveProfile,
    toggleFollow,
    logout,
    toggleEditMode,
    togglePreviewMode,
    refreshProfile: loadProfileData,
  };
}
