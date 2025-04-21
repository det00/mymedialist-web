// src/hooks/useProfile.ts
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { profileService, ProfileData } from "@/lib/profile";
import { authService } from "@/lib/auth";

export function useProfile(userId?: string) {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [previewMode, setPreviewMode] = useState<boolean>(false);
  const router = useRouter();

  // Cargar datos del perfil
  const loadProfileData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Verificar autenticación
      const isAuthenticated = authService.isAuthenticated();
      if (!isAuthenticated) {
        router.push("/");
        return;
      }
      
      let profile: ProfileData;
      
      // Si tenemos un ID, cargamos ese perfil específico
      // Si no, cargamos el perfil del usuario autenticado
      if (userId) {
        profile = await profileService.getUserProfile(userId);
      } else {
        profile = await profileService.getMyProfile();
      }
      
      setProfileData(profile);
    } catch (err) {
      console.error("Error al cargar datos de perfil:", err);
      setError("No se pudieron cargar los datos del perfil");
    } finally {
      setLoading(false);
    }
  };

  // Guardar cambios del perfil
  const saveProfile = async (updatedData: Partial<ProfileData>) => {
    try {
      if (!profileData) {
        throw new Error("No hay datos de perfil para actualizar");
      }
      
      // Si se actualiza el avatar, llamar al endpoint específico
      if (updatedData.avatar && updatedData.avatar !== profileData.avatar) {
        await profileService.updateAvatar(updatedData.avatar);
      }
      
      // Actualizar el resto de datos del perfil
      await profileService.updateProfile(updatedData);
      
      // Actualizar los datos locales
      setProfileData({
        ...profileData,
        ...updatedData
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
      if (!profileData || profileData.esMiPerfil) {
        return false;
      }
      
      const response = await profileService.toggleFollow(profileData.id);
      
      // Actualizar estado local
      setProfileData({
        ...profileData,
        siguiendo: response.siguiendo
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
    loadProfileData();
  }, [userId]);

  return {
    profileData,
    loading,
    error,
    isEditMode,
    previewMode,
    setProfileData,
    saveProfile,
    toggleFollow,
    logout,
    toggleEditMode,
    togglePreviewMode,
    refreshProfile: loadProfileData
  };
}