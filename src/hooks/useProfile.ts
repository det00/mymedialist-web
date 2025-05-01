// src/hooks/useProfile.ts
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { profileService } from "@/lib/profile";
import { authService } from "@/lib/auth";
import { Perfil } from "@/lib/types";

export function useProfile(idUsuario: number) {
  const [datosPerfil, setDatosPerfil] = useState<Perfil | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [previewMode, setPreviewMode] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    console.log("ID", idUsuario);
  }, [idUsuario]);

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

      setDatosPerfil(perfil);
    } catch (err) {
      console.error("Error al cargar datos de perfil:", err);
      setError("No se pudieron cargar los datos del perfil");
    } finally {
      setLoading(false);
    }
  };

  // Guardar cambios del perfil
  const saveProfile = async (updatedData: Partial<Perfil>) => {
    try {
      if (!datosPerfil) {
        throw new Error("No hay datos de perfil para actualizar");
      }

      // Actualizar los datos locales
      setDatosPerfil({
        ...datosPerfil,
        ...updatedData,
      });

      // Salir del modo edición
      setIsEditMode(false);

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
    loadProfileData(idUsuario);
  }, [idUsuario]);

  return {
    datosPerfil,
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
