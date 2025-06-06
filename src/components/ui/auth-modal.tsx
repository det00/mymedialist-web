"use client";

import { useState, useCallback, useEffect } from "react";
import { LoginForm } from "../login-form";
import { RegisterForm } from "../register-form";

interface AuthModalProps {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
  initialView?: "login" | "register";
}

export function AuthModal({ showModal, setShowModal, initialView = "login" }: AuthModalProps) {
  const [currentView, setCurrentView] = useState<"login" | "register">(initialView);

  // Actualizar currentView cuando cambia initialView
  useEffect(() => {
    setCurrentView(initialView);
  }, [initialView]);

  // Usar useCallback para evitar recreaciones innecesarias de estas funciones
  const showLogin = useCallback(() => {
    console.log("Cambiando a vista de login");
    setCurrentView("login");
  }, []);
  
  const showRegister = useCallback(() => {
    console.log("Cambiando a vista de registro");
    setCurrentView("register");
  }, []);

  // Si el modal no está visible, no renderizar nada
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 flex min-h-svh w-full items-center justify-center p-6 md:p-10 z-50 bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        {currentView === "login" ? (
          <LoginForm 
            showInicioSesion={setShowModal} 
            showRegister={showRegister}
          />
        ) : (
          <RegisterForm 
            showRegistro={setShowModal} 
            showLogin={showLogin}
          />
        )}
      </div>
    </div>
  );
}