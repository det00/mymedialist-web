import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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
import { ProfileData } from "@/lib/types";

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profileData: ProfileData;
  onUpdateSuccess: () => void;
}

export function EditProfileDialog({ open, onOpenChange, profileData, onUpdateSuccess }: EditProfileDialogProps) {
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
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Cargar datos del perfil cuando cambie
  useEffect(() => {
    if (profileData) {
      setProfileName(profileData.nombre);
      setProfileBio(profileData.bio || "");
      setAvatarId(profileData.avatar || "avatar1");
    }
  }, [profileData]);
  
  // Limpiar mensajes cuando se abre/cierra el diálogo
  useEffect(() => {
    if (!open) {
      setError(null);
      setSuccess(null);
    }
  }, [open]);
  
  // Manejar cambio de contraseña
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
    setSuccess(null);
    
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
      
      // Actualizar también el avatar en localStorage para que se refleje en la navbar
      authService.setUserAvatar(avatarId);
      
      setSuccess("Perfil actualizado correctamente");
      onUpdateSuccess();
      
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
      
      authService.logout();
      window.location.href = "/";
      
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al eliminar la cuenta");
      setDeletingAccount(false);
    }
  };
  
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Configuración del perfil</DialogTitle>
            <DialogDescription>
              Actualiza tus datos personales, cambia tu contraseña o elimina tu cuenta
            </DialogDescription>
          </DialogHeader>
          
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
          
          <Tabs defaultValue="profile" className="w-full">
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
            <TabsContent value="profile" className="space-y-4">
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
                
                <Button type="submit" disabled={savingProfile} className="w-full">
                  {savingProfile ? "Guardando..." : "Guardar cambios"}
                </Button>
              </form>
            </TabsContent>
            
            {/* Configuración de apariencia */}
            <TabsContent value="appearance" className="space-y-6">
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
            </TabsContent>
            
            {/* Configuración de cuenta */}
            <TabsContent value="account" className="space-y-6">
              {/* Cambiar contraseña */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <KeyRound className="h-5 w-5" />
                  <h3 className="text-lg font-medium">Cambiar contraseña</h3>
                </div>
                
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
                  
                  <Button type="submit" disabled={savingPassword} className="w-full">
                    {savingPassword ? "Actualizando..." : "Actualizar contraseña"}
                  </Button>
                </form>
              </div>
              
              {/* Eliminar cuenta */}
              <div className="space-y-4 border-t pt-6">
                <div className="flex items-center gap-2">
                  <UserX className="h-5 w-5 text-destructive" />
                  <h3 className="text-lg font-medium text-destructive">Eliminar cuenta</h3>
                </div>
                
                <div className="text-sm space-y-2">
                  <p>Esta acción eliminará permanentemente tu cuenta, incluyendo:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Tu perfil y datos personales</li>
                    <li>Tu colección completa</li>
                    <li>Todas tus reseñas y valoraciones</li>
                    <li>Tus conexiones de amistad</li>
                  </ul>
                  <p className="font-medium mt-4">Esta acción no se puede deshacer.</p>
                </div>
                
                <Button 
                  variant="destructive" 
                  onClick={() => setShowDeleteAccountDialog(true)}
                  className="w-full"
                >
                  Eliminar mi cuenta
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
      
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
    </>
  );
}
