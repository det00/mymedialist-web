import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AvatarSelector } from "@/components/AvatarSelector";
import { UserAvatar } from "@/components/UserAvatar";
import { Separator } from "@/components/ui/separator";
import { Save, X } from "lucide-react";

// Interfaz para los datos del perfil
interface ProfileData {
  id: string;
  name: string;
  username: string;
  bio: string;
  joinDate: string;
  email: string;
  avatar: string;
  stats: {
    totalContent: number;
    completed: number;
    inProgress: number;
    planned: number;
    dropped: number;
    movies: number;
    series: number;
    books: number;
    games: number;
  };
  isCurrentUser: boolean;
}

interface ProfileFormProps {
  profileData: ProfileData;
  onSave: (data: Partial<ProfileData>) => void;
  onCancel: () => void;
}

export function ProfileForm({ profileData, onSave, onCancel }: ProfileFormProps) {
  const [formData, setFormData] = useState({
    name: profileData.name,
    username: profileData.username,
    email: profileData.email,
    bio: profileData.bio,
    avatar: profileData.avatar
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // Manejar cambios en los campos del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpiar errores al editar
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };
  
  // Manejar selección de avatar
  const handleAvatarSelect = (avatarId: string) => {
    setFormData(prev => ({ ...prev, avatar: avatarId }));
  };

  // Validar y enviar el formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación básica
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "El nombre es obligatorio";
    }
    
    if (!formData.username.trim()) {
      newErrors.username = "El nombre de usuario es obligatorio";
    } else if (!/^[a-z0-9_]+$/.test(formData.username)) {
      newErrors.username = "Solo letras minúsculas, números y guiones bajos";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "El email es obligatorio";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }
    
    // Si hay errores, actualizar estado y cancelar envío
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Simulación de guardado
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simular petición
      onSave(formData);
    } catch (error) {
      console.error("Error al guardar el perfil:", error);
      setErrors({ submit: "Error al guardar los cambios" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Avatar */}
      <div className="space-y-2">
        <Label>Avatar</Label>
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <UserAvatar avatarData={formData.avatar} size="xl" />
          <div className="flex-1">
            <AvatarSelector selectedAvatar={formData.avatar} onSelectAvatar={handleAvatarSelect} />
          </div>
        </div>
      </div>
      
      <Separator />
      
      {/* Información personal */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Información personal</h3>
        
        {/* Nombre */}
        <div className="space-y-2">
          <Label htmlFor="name">Nombre completo</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Tu nombre"
            error={errors.name}
          />
          {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
        </div>
        
        {/* Nombre de usuario */}
        <div className="space-y-2">
          <Label htmlFor="username">Nombre de usuario</Label>
          <div className="flex">
            <span className="flex items-center px-3 bg-muted border border-r-0 rounded-l-md">
              @
            </span>
            <Input
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="username"
              className="rounded-l-none"
              error={errors.username}
            />
          </div>
          {errors.username && <p className="text-sm text-destructive">{errors.username}</p>}
          <p className="text-xs text-muted-foreground">Este nombre será visible para otros usuarios.</p>
        </div>
        
        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="tu@email.com"
            error={errors.email}
          />
          {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
          <p className="text-xs text-muted-foreground">No compartiremos tu email con otros usuarios.</p>
        </div>
        
        {/* Bio */}
        <div className="space-y-2">
          <Label htmlFor="bio">Sobre mí</Label>
          <Textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Cuéntanos sobre ti y tus gustos..."
            rows={4}
            error={errors.bio}
          />
          {errors.bio && <p className="text-sm text-destructive">{errors.bio}</p>}
          <p className="text-xs text-muted-foreground">Describe tus gustos y lo que te gusta ver, leer o jugar.</p>
        </div>
      </div>
      
      {/* Error general */}
      {errors.submit && (
        <div className="p-3 bg-destructive/10 text-destructive rounded-md">
          {errors.submit}
        </div>
      )}
      
      {/* Botones de acción */}
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          <X className="h-4 w-4 mr-2" />
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Guardando...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Guardar cambios
            </>
          )}
        </Button>
      </div>
    </form>
  );
}