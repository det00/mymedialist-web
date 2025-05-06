"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import authService from "@/lib/auth";

interface DeleteAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function DeleteAccountDialog({
  open,
  onOpenChange,
  onSuccess,
}: DeleteAccountDialogProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteAccount = async () => {
    if (!password) {
      setError("Debes ingresar tu contraseña para confirmar");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      // Utilizar el método deleteAccount del servicio de auth
      await authService.deleteAccount(password);
      
      // Si llegamos aquí, la cuenta se eliminó correctamente
      setIsLoading(false);
      onOpenChange(false);
      
      // Ejecutar callback de éxito si existe
      if (onSuccess) {
        onSuccess();
      } else {
        // Redirigir al usuario a la página principal
        window.location.href = "/";
      }
    } catch (err) {
      setIsLoading(false);
      setError(err instanceof Error ? err.message : "Error al eliminar la cuenta");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-destructive">Eliminar cuenta</DialogTitle>
          <DialogDescription>
            Esta acción no se puede deshacer. Se eliminará permanentemente tu cuenta y todos tus datos.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="grid gap-2">
            <Label htmlFor="password" className="text-left">
              Ingresa tu contraseña para confirmar
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Tu contraseña"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeleteAccount}
            disabled={isLoading}
          >
            {isLoading ? "Eliminando..." : "Eliminar mi cuenta"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
