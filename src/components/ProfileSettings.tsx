import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ThemeSwitch } from "@/components/theme-switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Bell,
  Shield,
  Paintbrush,
  Globe,
  Key,
  UserX,
  KeyRound,
  DownloadCloud,
  Lock,
  Eye,
  EyeOff,
  Languages,
  Info,
  Badge
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

interface ProfileSettingsProps {
  userId: string;
}

export function ProfileSettings({ userId }: ProfileSettingsProps) {
  const [activeTab, setActiveTab] = useState<string>("notifications");
  const [showDeleteAccountDialog, setShowDeleteAccountDialog] = useState<boolean>(false);
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [savingPreferences, setSavingPreferences] = useState<boolean>(false);
  const [savingPassword, setSavingPassword] = useState<boolean>(false);
  
  // Configuración de notificaciones
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    friendRequests: true,
    mentions: true,
    friendActivity: true,
    recommendations: true,
    marketing: false,
    newsletter: true
  });
  
  // Configuración de privacidad
  const [privacySettings, setPrivacySettings] = useState({
    publicProfile: true,
    showActivity: true,
    showCollection: true,
    showWatchingNow: true,
    allowFriendRequests: true,
    searchable: true,
    dataSharing: false
  });
  
  // Configuración de apariencia
  const [appearanceSettings, setAppearanceSettings] = useState({
    language: "es",
    theme: "system",
    contentDensity: "comfortable",
    animationReduced: false,
    highContrast: false
  });
  
  // Manejador genérico para cambios en switches de notificaciones
  const handleNotificationChange = (setting: keyof typeof notificationSettings) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };
  
  // Manejador genérico para cambios en switches de privacidad
  const handlePrivacyChange = (setting: keyof typeof privacySettings) => {
    setPrivacySettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };
  
  // Manejar guardar preferencias
  const handleSavePreferences = async () => {
    setSavingPreferences(true);
    
    // Simular una llamada a la API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mostrar una alerta de éxito o manejar errores
    alert("Preferencias guardadas correctamente");
    
    setSavingPreferences(false);
  };
  
  // Manejar cambio de contraseña
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación básica
    if (!currentPassword) {
      alert("Por favor, introduce tu contraseña actual");
      return;
    }
    
    if (!newPassword) {
      alert("Por favor, introduce una nueva contraseña");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }
    
    setSavingPassword(true);
    
    // Simular una llamada a la API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mostrar una alerta de éxito o manejar errores
    alert("Contraseña cambiada correctamente");
    
    // Limpiar el formulario
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    
    setSavingPassword(false);
  };
  
  // Manejar eliminación de cuenta
  const handleDeleteAccount = async () => {
    // Aquí iría la lógica para eliminar la cuenta
    // En un caso real, habría que hacer una llamada a la API
    console.log("Cuenta eliminada");
    
    // Redireccionar al inicio
    window.location.href = "/";
  };
  
  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notificaciones
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Privacidad
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Paintbrush className="h-4 w-4" />
            Apariencia
          </TabsTrigger>
          <TabsTrigger value="account" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            Cuenta
          </TabsTrigger>
        </TabsList>
        
        {/* Configuración de notificaciones */}
        <TabsContent value="notifications" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notificaciones</CardTitle>
              <CardDescription>
                Configura cómo y cuándo recibes notificaciones
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Canales de notificación */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Canales de notificación</h3>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">Notificaciones por email</Label>
                    <p className="text-sm text-muted-foreground">
                      Recibe actualizaciones importantes en tu correo electrónico
                    </p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={() => handleNotificationChange('emailNotifications')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="push-notifications">Notificaciones push</Label>
                    <p className="text-sm text-muted-foreground">
                      Recibe notificaciones en tiempo real en tu navegador o dispositivo
                    </p>
                  </div>
                  <Switch
                    id="push-notifications"
                    checked={notificationSettings.pushNotifications}
                    onCheckedChange={() => handleNotificationChange('pushNotifications')}
                  />
                </div>
              </div>
              
              <Separator />
              
              {/* Tipos de notificaciones */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Tipos de notificaciones</h3>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="friend-requests">Solicitudes de amistad</Label>
                    <p className="text-sm text-muted-foreground">
                      Cuando alguien te envía una solicitud de amistad
                    </p>
                  </div>
                  <Switch
                    id="friend-requests"
                    checked={notificationSettings.friendRequests}
                    onCheckedChange={() => handleNotificationChange('friendRequests')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="mentions">Menciones y respuestas</Label>
                    <p className="text-sm text-muted-foreground">
                      Cuando alguien te menciona o responde a tus comentarios
                    </p>
                  </div>
                  <Switch
                    id="mentions"
                    checked={notificationSettings.mentions}
                    onCheckedChange={() => handleNotificationChange('mentions')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="friend-activity">Actividad de amigos</Label>
                    <p className="text-sm text-muted-foreground">
                      Cuando tus amigos añaden o completan contenido
                    </p>
                  </div>
                  <Switch
                    id="friend-activity"
                    checked={notificationSettings.friendActivity}
                    onCheckedChange={() => handleNotificationChange('friendActivity')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="recommendations">Recomendaciones</Label>
                    <p className="text-sm text-muted-foreground">
                      Sugerencias de contenido basadas en tus gustos
                    </p>
                  </div>
                  <Switch
                    id="recommendations"
                    checked={notificationSettings.recommendations}
                    onCheckedChange={() => handleNotificationChange('recommendations')}
                  />
                </div>
              </div>
              
              <Separator />
              
              {/* Comunicaciones de marketing */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Comunicaciones de marketing</h3>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="marketing">Emails promocionales</Label>
                    <p className="text-sm text-muted-foreground">
                      Recibe ofertas, promociones y novedades relacionadas con MyMediaList
                    </p>
                  </div>
                  <Switch
                    id="marketing"
                    checked={notificationSettings.marketing}
                    onCheckedChange={() => handleNotificationChange('marketing')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="newsletter">Newsletter</Label>
                    <p className="text-sm text-muted-foreground">
                      Recibe actualizaciones mensuales con lo más destacado
                    </p>
                  </div>
                  <Switch
                    id="newsletter"
                    checked={notificationSettings.newsletter}
                    onCheckedChange={() => handleNotificationChange('newsletter')}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleSavePreferences} 
                disabled={savingPreferences}
              >
                {savingPreferences ? "Guardando..." : "Guardar preferencias"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Configuración de privacidad */}
        <TabsContent value="privacy" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Privacidad</CardTitle>
              <CardDescription>
                Gestiona quién puede ver tu perfil y contenido
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Visibilidad del perfil */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Visibilidad del perfil</h3>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="public-profile">Perfil público</Label>
                    <p className="text-sm text-muted-foreground">
                      Permitir que cualquier persona vea tu perfil
                    </p>
                  </div>
                  <Switch
                    id="public-profile"
                    checked={privacySettings.publicProfile}
                    onCheckedChange={() => handlePrivacyChange('publicProfile')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="show-activity">Actividad visible</Label>
                    <p className="text-sm text-muted-foreground">
                      Mostrar tu actividad reciente en tu perfil
                    </p>
                  </div>
                  <Switch
                    id="show-activity"
                    checked={privacySettings.showActivity}
                    onCheckedChange={() => handlePrivacyChange('showActivity')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="show-collection">Colección visible</Label>
                    <p className="text-sm text-muted-foreground">
                      Permitir que otros vean tu colección completa
                    </p>
                  </div>
                  <Switch
                    id="show-collection"
                    checked={privacySettings.showCollection}
                    onCheckedChange={() => handlePrivacyChange('showCollection')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="show-watching-now">Mostrar &quot;Viendo ahora&quot;</Label>
                    <p className="text-sm text-muted-foreground">
                      Mostrar lo que estás viendo actualmente en tu perfil
                    </p>
                  </div>
                  <Switch
                    id="show-watching-now"
                    checked={privacySettings.showWatchingNow}
                    onCheckedChange={() => handlePrivacyChange('showWatchingNow')}
                  />
                </div>
              </div>
              
              <Separator />
              
              {/* Interacciones */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Interacciones</h3>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="allow-friend-requests">Solicitudes de amistad</Label>
                    <p className="text-sm text-muted-foreground">
                      Permitir que otros usuarios te envíen solicitudes de amistad
                    </p>
                  </div>
                  <Switch
                    id="allow-friend-requests"
                    checked={privacySettings.allowFriendRequests}
                    onCheckedChange={() => handlePrivacyChange('allowFriendRequests')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="searchable">Aparecer en búsquedas</Label>
                    <p className="text-sm text-muted-foreground">
                      Permitir que tu perfil aparezca en resultados de búsqueda
                    </p>
                  </div>
                  <Switch
                    id="searchable"
                    checked={privacySettings.searchable}
                    onCheckedChange={() => handlePrivacyChange('searchable')}
                  />
                </div>
              </div>
              
              <Separator />
              
              {/* Datos */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Datos</h3>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="data-sharing">Compartir datos de uso</Label>
                    <p className="text-sm text-muted-foreground">
                      Compartir datos anónimos de uso para mejorar el servicio
                    </p>
                  </div>
                  <Switch
                    id="data-sharing"
                    checked={privacySettings.dataSharing}
                    onCheckedChange={() => handlePrivacyChange('dataSharing')}
                  />
                </div>
                
                <div className="pt-2">
                  <Button variant="outline" className="w-full sm:w-auto">
                    <DownloadCloud className="h-4 w-4 mr-2" />
                    Descargar mis datos
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleSavePreferences} 
                disabled={savingPreferences}
              >
                {savingPreferences ? "Guardando..." : "Guardar preferencias"}
              </Button>
            </CardFooter>
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
                    value={appearanceSettings.language}
                    onValueChange={(value) => setAppearanceSettings({ ...appearanceSettings, language: value })}
                  >
                    <SelectTrigger id="language">
                      <SelectValue placeholder="Selecciona un idioma" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                      <SelectItem value="it">Italiano</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Separator />
              
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
                
                <div className="grid gap-2 pt-2">
                  <Label htmlFor="content-density">Densidad de contenido</Label>
                  <Select
                    value={appearanceSettings.contentDensity}
                    onValueChange={(value) => setAppearanceSettings({ ...appearanceSettings, contentDensity: value })}
                  >
                    <SelectTrigger id="content-density">
                      <SelectValue placeholder="Selecciona la densidad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="compact">Compacto</SelectItem>
                      <SelectItem value="comfortable">Cómodo</SelectItem>
                      <SelectItem value="spacious">Espacioso</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Separator />
              
              {/* Accesibilidad */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  <h3 className="text-lg font-medium">Accesibilidad</h3>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="animation-reduced">Reducir animaciones</Label>
                    <p className="text-sm text-muted-foreground">
                      Minimiza las animaciones en la interfaz
                    </p>
                  </div>
                  <Switch
                    id="animation-reduced"
                    checked={appearanceSettings.animationReduced}
                    onCheckedChange={(value) => setAppearanceSettings({ ...appearanceSettings, animationReduced: value })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="high-contrast">Alto contraste</Label>
                    <p className="text-sm text-muted-foreground">
                      Aumenta el contraste para mejorar la legibilidad
                    </p>
                  </div>
                  <Switch
                    id="high-contrast"
                    checked={appearanceSettings.highContrast}
                    onCheckedChange={(value) => setAppearanceSettings({ ...appearanceSettings, highContrast: value })}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleSavePreferences} 
                disabled={savingPreferences}
              >
                {savingPreferences ? "Guardando..." : "Guardar preferencias"}
              </Button>
            </CardFooter>
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
                  <div className="relative">
                    <Input
                      id="current-password"
                      type={showPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="new-password">Nueva contraseña</Label>
                  <div className="relative">
                    <Input
                      id="new-password"
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmar nueva contraseña</Label>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                    />
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  disabled={savingPassword}
                >
                  {savingPassword ? "Actualizando..." : "Actualizar contraseña"}
                </Button>
              </form>
            </CardContent>
          </Card>
          
          {/* Sesiones activas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Sesiones activas
              </CardTitle>
              <CardDescription>
                Gestiona tus sesiones activas en diferentes dispositivos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Este dispositivo</h4>
                      <p className="text-sm text-muted-foreground">Chrome en Windows • Madrid, España</p>
                      <p className="text-xs text-muted-foreground mt-1">Última actividad: Ahora mismo</p>
                    </div>
                    <Badge>Actual</Badge>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">iPhone 13</h4>
                      <p className="text-sm text-muted-foreground">Aplicación iOS • Madrid, España</p>
                      <p className="text-xs text-muted-foreground mt-1">Última actividad: Hace 3 horas</p>
                    </div>
                    <Button variant="outline" size="sm">Cerrar sesión</Button>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">MacBook Pro</h4>
                      <p className="text-sm text-muted-foreground">Safari en macOS • Barcelona, España</p>
                      <p className="text-xs text-muted-foreground mt-1">Última actividad: Hace 2 días</p>
                    </div>
                    <Button variant="outline" size="sm">Cerrar sesión</Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full sm:w-auto">
                Cerrar todas las sesiones
              </Button>
            </CardFooter>
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
            <CardFooter>
              <Button 
                variant="destructive" 
                onClick={() => setShowDeleteAccountDialog(true)}
              >
                Eliminar mi cuenta
              </Button>
            </CardFooter>
          </Card>
          
          {/* Información legal */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Información legal
              </CardTitle>
              <CardDescription>
                Documentos legales y política de privacidad
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <p className="text-sm">Términos y condiciones</p>
                  <Button variant="link" size="sm">Ver</Button>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm">Política de privacidad</p>
                  <Button variant="link" size="sm">Ver</Button>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm">Política de cookies</p>
                  <Button variant="link" size="sm">Ver</Button>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm">Licencias de terceros</p>
                  <Button variant="link" size="sm">Ver</Button>
                </div>
              </div>
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
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDeleteAccount}
            >
              Eliminar permanentemente
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}