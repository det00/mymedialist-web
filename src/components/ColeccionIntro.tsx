"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { SearchIcon, ListPlusIcon, UsersIcon } from "lucide-react";

export function ColeccionIntro() {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2 py-6">
        <h2 className="text-xl font-semibold">¡Bienvenido a tu colección!</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Aquí podrás ver y organizar todo el contenido que añadas a MyMediaList.
          Empieza añadiendo películas, series, libros o juegos.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <SearchIcon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-medium text-base">Busca contenido</h3>
            <p className="text-sm text-muted-foreground">
              Explora nuestra base de datos con miles de películas, series, libros y juegos.
            </p>
            <Link href="/busqueda?busqueda=&tipo=P" className="w-full">
              <Button className="w-full" variant="outline">Buscar</Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <ListPlusIcon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-medium text-base">Añade a tu colección</h3>
            <p className="text-sm text-muted-foreground">
              Marca el contenido como completado, en progreso, pendiente o abandonado.
            </p>
            <Button className="w-full" variant="outline" disabled>
              Empezar
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <UsersIcon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-medium text-base">Conecta con amigos</h3>
            <p className="text-sm text-muted-foreground">
              Descubre lo que ven tus amigos y comparte tus recomendaciones.
            </p>
            <Link href="/amigos" className="w-full">
              <Button className="w-full" variant="outline">Explorar</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}