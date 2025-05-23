import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeSwitch } from "@/components/theme-switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  KeyRound,
  Paintbrush,
  Languages,
  User,
  UserX
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import api from "@/lib/axios";
import { authService } from "@/lib/auth";
import { UserData } from "@/lib/types";

interface ProfileSettingsProps {
  userId: string;
}

export function ProfileSettings({ userId }: ProfileSettingsProps) {
  const [activeTab, setActiveTab] = useState<string>("profile");
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [savingPassword, setSavingPassword] = useState<boolean>(false);
  const [language, setLanguage] = useState<string>("es");
  const [showDeleteAccountDialog, setShowDeleteAccountDialog] = useState<boolean>(false);
  const [deletePassword, setDeletePassword] = useState<string>("");
  const [deletingAccount, setDeletingAccount] = useState<boolean>(false);
  
  // Estado para el perfil
  const [profileName, setProfileName] = useState<string>("");
  const [profileBio, setProfileBio] = useState<string>("");
  const [avatarId, setAvatarId] = useState<string>("avatar1");
  const [savingProfile, setSavingProfile] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Cargar datos del perfil al montar
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = authService.getToken();
        if (!token) {
          setError("No hay token de autenticación");
          setLoading(false);
          return;
        }

        const response = await api.get(`/perfil/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (response.data) {
          setProfileName(response.data.nombre);
          setProfileBio(response.data.email); // Como bio no está en UserData, usamos email temporalmente
        }
      } catch (err) {
        console.error("Error al obtener datos del usuario:", err);
        setError("Error al cargar los datos del perfil");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);
  
  // Manejar cambio de contraseña
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación básica
    if (!currentPassword) {
      setError("Por favor, introduce tu contraseña actual");
      return;
    }
    
    if (!newPassword) {
      setError("Por favor, introduce una nueva contraseña");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    
    setSavingPassword(true);
    setError(null);
    setSuccess(null);
    
    try {
      const token = authService.getToken();
      await api.post("/auth/change-password", {
        currentPassword,
        newPassword
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Éxito - limpiar el formulario
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSuccess("Contraseña cambiada correctamente");
      
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al cambiar la contraseña");
    } finally {
      setSavingPassword(false);
    }
  };
  
  // Manejar actualización de perfil
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setError(null);
    
    try {
      const token = authService.getToken();
      await api.put("/perfil", {
        name: profileName,
        bio: profileBio,
        avatar_id: avatarId
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setSuccess("Perfil actualizado correctamente");
      
      // Recargar los datos del perfil
      const response = await api.get(`/perfil/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data) {
        setProfileName(response.data.nombre);
        setProfileBio(response.data.email);
      }
      
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al actualizar el perfil");
    } finally {
      setSavingProfile(false);
    }
  };
  
  // Manejar eliminación de cuenta
  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      setError("Por favor, introduce tu contraseña para confirmar");
      return;
    }
    
    setDeletingAccount(true);
    setError(null);
    
    try {
      const token = authService.getToken();
      await api.delete("/auth/delete-account", {
        headers: {
          Authorization: `Bearer ${token}`
        },
        data: {
          password: deletePassword
        }
      });
      
      // Cerrar sesión y redirigir
      authService.logout();
      window.location.href = "/";
      
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al eliminar la cuenta");
      setDeletingAccount(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-destructive/10 text-destructive p-3 rounded-md mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-500/10 text-green-500 p-3 rounded-md mb-4">
          {success}
        </div>
      )}
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Perfil
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Paintbrush className="h-4 w-4" />
            Apariencia
          </TabsTrigger>
          <TabsTrigger value="account" className="flex items-center gap-2">
            <KeyRound className="h-4 w-4" />
            Cuenta
          </TabsTrigger>
        </TabsList>
        
        {/* Configuración de perfil */}
        <TabsContent value="profile" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información del perfil</CardTitle>
              <CardDescription>
                Actualiza tu información pública
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre</Label>
                  <Input
                    id="name"
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    placeholder="Tu nombre"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio">Biografía</Label>
                  <Textarea
                    id="bio"
                    value={profileBio}
                    onChange={(e) => setProfileBio(e.target.value)}
                    placeholder="Cuéntanos sobre ti..."
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="avatar">Avatar</Label>
                  <Select
                    value={avatarId}
                    onValueChange={setAvatarId}
                  >
                    <SelectTrigger id="avatar">
                      <SelectValue placeholder="Selecciona un avatar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="avatar1">Avatar 1</SelectItem>
                      <SelectItem value="avatar2">Avatar 2</SelectItem>
                      <SelectItem value="avatar3">Avatar 3</SelectItem>
                      <SelectItem value="avatar4">Avatar 4</SelectItem>
                      <SelectItem value="avatar5">Avatar 5</SelectItem>
                      <SelectItem value="avatar6">Avatar 6</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  type="submit" 
                  disabled={savingProfile}
                  className="w-full sm:w-auto"
                >
                  {savingProfile ? "Guardando..." : "Guardar cambios"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Configuración de apariencia */}
        <TabsContent value="appearance" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Apariencia</CardTitle>
              <CardDescription>
                Personaliza cómo se ve la aplicación
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Idioma */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Languages className="h-5 w-5" />
                  <h3 className="text-lg font-medium">Idioma</h3>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="language">Idioma de la interfaz</Label>
                  <Select
                    value={language}
                    onValueChange={setLanguage}
                  >
                    <SelectTrigger id="language">
                      <SelectValue placeholder="Selecciona un idioma" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Tema */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Paintbrush className="h-5 w-5" />
                  <h3 className="text-lg font-medium">Tema</h3>
                </div>
                
                <div className="flex items-center justify-between">
                  <Label>Tema de la aplicación</Label>
                  <ThemeSwitch />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Configuración de cuenta */}
        <TabsContent value="account" className="mt-6 space-y-6">
          {/* Cambiar contraseña */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <KeyRound className="h-5 w-5" />
                Cambiar contraseña
              </CardTitle>
              <CardDescription>
                Actualiza tu contraseña para mantener tu cuenta segura
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Contraseña actual</Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="new-password">Nueva contraseña</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmar nueva contraseña</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  disabled={savingPassword}
                  className="w-full sm:w-auto"
                >
                  {savingPassword ? "Actualizando..." : "Actualizar contraseña"}
                </Button>
              </form>
            </CardContent>
          </Card>
          
          {/* Eliminar cuenta */}
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive flex items-center gap-2">
                <UserX className="h-5 w-5" />
                Eliminar cuenta
              </CardTitle>
              <CardDescription>
                Eliminar permanentemente tu cuenta y todos tus datos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm">
                  Esta acción eliminará permanentemente tu cuenta, incluyendo:
                </p>
                <ul className="list-disc ml-6 text-sm space-y-1">
                  <li>Tu perfil y datos personales</li>
                  <li>Tu colección completa</li>
                  <li>Todas tus reseñas y valoraciones</li>
                  <li>Tus conexiones de amistad</li>
                </ul>
                <p className="text-sm font-medium mt-4">
                  Esta acción no se puede deshacer.
                </p>
              </div>
            </CardContent>
            <CardContent>
              <Button 
                variant="destructive" 
                onClick={() => setShowDeleteAccountDialog(true)}
              >
                Eliminar mi cuenta
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Diálogo de confirmación para eliminar cuenta */}
      <AlertDialog open={showDeleteAccountDialog} onOpenChange={setShowDeleteAccountDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar cuenta permanentemente?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminarán permanentemente todos tus datos, 
              colección, reseñas y valoraciones. Las amistades también se eliminarán.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              <Label htmlFor="delete-password">Confirma tu contraseña</Label>
              <Input
                id="delete-password"
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDeleteAccount}
              disabled={deletingAccount}
            >
              {deletingAccount ? "Eliminando..." : "Eliminar permanentemente"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
