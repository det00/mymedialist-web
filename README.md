# My Media List 📚🎬🎮

## Descripción

My Media List es una aplicación web moderna diseñada para ayudarte a organizar y gestionar tu colección personal de medios. Ya sean películas, series, libros, videojuegos o cualquier otro tipo de contenido multimedia, esta plataforma te permite catalogar, calificar y llevar un seguimiento de todo lo que has consumido o deseas consumir en el futuro.

## Características Principales

- **Gestión de Colecciones**: Organiza tus medios por categorías personalizadas
- **Seguimiento de Progreso**: Marca elementos como pendientes, en progreso o completados
- **Interfaz Moderna**: Diseño responsive con modo claro/oscuro usando TailwindCSS
- **Experiencia Personalizada**: Crea perfiles y personaliza tu experiencia

## Tecnologías Utilizadas

- **Frontend**: Next.js 15, React 19, TailwindCSS 4
- **UI Components**: Radix UI, Framer Motion
- **Estado**: TanStack React Query
- **Estilos**: Tailwind CSS con class-variance-authority

## Arquitectura del Proyecto

Este repositorio contiene únicamente el **frontend** de la aplicación My Media List. La aplicación completa está compuesta por:

- **Frontend** (este repositorio): Interfaz de usuario desarrollada con Next.js
- **Backend**: API y lógica de negocio disponible en [my-media-list-backend](https://github.com/Raen98/my-media-list-backend.git)

Para ejecutar la aplicación completa, necesitarás configurar tanto el frontend como el backend.

## Comenzando

Para ejecutar el proyecto localmente:

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación.

## Despliegue

Esta aplicación puede ser fácilmente desplegada en la plataforma [Vercel](https://vercel.com) o cualquier otro proveedor que soporte aplicaciones Next.js.

### Demo en vivo

Puedes ver una versión en vivo de la aplicación en: [https://mymedialist-henna.vercel.app/](https://mymedialist-henna.vercel.app/)

> Nota: Reemplaza la URL anterior con la URL real de tu aplicación desplegada en Vercel.

## Contribuciones

Las contribuciones son bienvenidas. Si deseas contribuir al proyecto, por favor:

1. Haz fork del repositorio
2. Crea una rama para tu función (`git checkout -b feature/amazing-feature`)
3. Haz commit de tus cambios (`git commit -m 'Añadir nueva característica'`)
4. Haz push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo `LICENSE` para más detalles.
