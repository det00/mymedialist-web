"use client"

import { useParams } from "next/navigation";
import { ProfilePage } from "@/app/perfil/page";

export default function UserProfilePage() {
  const params = useParams();
  const userId = params?.id as string;
  
  // Renderiza el mismo componente ProfilePage pero con el ID del usuario
  return <ProfilePage />;
}