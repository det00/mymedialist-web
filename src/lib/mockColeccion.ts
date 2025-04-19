import { Contenido } from "@/lib/types";

// Datos estáticos para pruebas
export const mockColeccion: Contenido[] = [
  // Series
  {
    id_api: "1",
    tipo: "serie",
    imagen: "https://www.themoviedb.org/t/p/w600_and_h900_bestv2/ffz9il7a1JfRqcz94NZdLiKF5sl.jpg",
    titulo: "Breaking Bad",
    descripcion: "Un profesor de química con cáncer comienza a fabricar y vender metanfetamina para asegurar el futuro financiero de su familia.",
    genero: ["Drama", "Crimen"],
    autor: "Vince Gilligan",
    fechaLanzamiento: "2008-01-20",
    temporadas: 5,
    episodios: 62,
    valoracion: 9.5,
    item: {
      id: "a1",
      estado: "C"
    },
    amigos: [
      {
        id: "1",
        estado: "E",
        imagen_id: "user1",
        progreso: "T3E8"
      }
    ]
  },
  {
    id_api: "2",
    tipo: "serie",
    imagen: "https://www.themoviedb.org/t/p/w600_and_h900_bestv2/fDoCU1L6T1PCyZhKlQJurczwq7Q.jpg",
    titulo: "Stranger Things",
    descripcion: "Cuando un niño desaparece, un pequeño pueblo descubre un misterio que involucra experimentos secretos, fuerzas sobrenaturales y una niña muy extraña.",
    genero: ["Drama", "Fantasía", "Ciencia ficción"],
    autor: "The Duffer Brothers",
    fechaLanzamiento: "2016-07-15",
    temporadas: 4,
    episodios: 34,
    valoracion: 8.7,
    item: {
      id: "a2",
      estado: "E"
    },
    amigos: []
  },

  // Películas
  {
    id_api: "3",
    tipo: "pelicula",
    imagen: "https://www.themoviedb.org/t/p/w600_and_h900_bestv2/tVxDe01Zy3ffaLkoUgX6prZPJR8.jpg",
    titulo: "Interstellar",
    descripcion: "Un grupo de exploradores espaciales emprende la misión más importante de la historia de la humanidad: viajar más allá de nuestra galaxia para descubrir si la humanidad tiene un futuro entre las estrellas.",
    genero: ["Aventura", "Drama", "Ciencia ficción"],
    autor: "Christopher Nolan",
    fechaLanzamiento: "2014-11-07",
    duracion: "169",
    valoracion: 8.6,
    item: {
      id: "a3",
      estado: "C"
    },
    amigos: []
  },
  {
    id_api: "4",
    tipo: "pelicula",
    imagen: "https://www.themoviedb.org/t/p/w600_and_h900_bestv2/d5NXSklXo0qyIYkgV94XAgMIckC.jpg",
    titulo: "Dune",
    descripcion: "Paul Atreides, un joven brillante y talentoso nacido en un gran destino que va más allá de su comprensión, debe viajar al planeta más peligroso del universo para asegurar el futuro de su familia y su gente.",
    genero: ["Ciencia ficción", "Aventura"],
    autor: "Denis Villeneuve",
    fechaLanzamiento: "2021-10-22",
    duracion: "155",
    valoracion: 8.2,
    item: {
      id: "a4",
      estado: "P"
    },
    amigos: []
  },

  // Libros
  {
    id_api: "5",
    tipo: "libro",
    imagen: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1327881361i/320.jpg",
    titulo: "Cien años de soledad",
    descripcion: "La historia de la familia Buendía a lo largo de siete generaciones en el pueblo ficticio de Macondo.",
    genero: ["Ficción literaria", "Realismo mágico"],
    autor: "Gabriel García Márquez",
    fechaLanzamiento: "1967",
    paginas: 417,
    valoracion: 9.2,
    item: {
      id: "a5",
      estado: "P"
    },
    amigos: []
  },
  {
    id_api: "6",
    tipo: "libro",
    imagen: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1586722975i/2767052.jpg",
    titulo: "El hobbit",
    descripcion: "La aventura del hobbit Bilbo Bolsón que viaja para ayudar a un grupo de enanos a recuperar su tesoro, custodiado por un dragón.",
    genero: ["Fantasía", "Aventura"],
    autor: "J.R.R. Tolkien",
    fechaLanzamiento: "1937",
    paginas: 310,
    valoracion: 8.8,
    item: {
      id: "a6",
      estado: "C"
    },
    amigos: []
  },

  // Videojuegos
  {
    id_api: "7",
    tipo: "videojuego",
    imagen: "https://assets.nintendo.com/image/upload/ar_16:9,c_lpad,w_801/b_white/f_auto/q_auto/ncom/software/switch/70010000000025/7137262b5a64d921e193653f8aa0b722925abc5680380ca0e18a5cfd91697f58",
    titulo: "The Legend of Zelda: Breath of the Wild",
    descripcion: "Un juego de aventuras donde Link despierta de un sueño de 100 años para descubrir que el reino de Hyrule ha sido devastado.",
    genero: ["Aventura", "Acción", "Mundo abierto"],
    autor: "Nintendo",
    fechaLanzamiento: "2017-03-03",
    valoracion: 9.7,
    item: {
      id: "a7",
      estado: "E"
    },
    amigos: []
  },
  {
    id_api: "8",
    tipo: "videojuego",
    imagen: "https://cdn-products.eneba.com/resized-products/XPuX0jkU50h9kPZlQvLxDt_aFMbOYO66f-TdULOR8ZA_350x200_1x-0.jpeg",
    titulo: "Red Dead Redemption 2",
    descripcion: "Un juego de acción y aventura ambientado en el Viejo Oeste en 1899, siguiendo la historia de Arthur Morgan y la banda de Van der Linde.",
    genero: ["Acción", "Aventura", "Mundo abierto"],
    autor: "Rockstar Games",
    fechaLanzamiento: "2018-10-26",
    valoracion: 9.6,
    item: {
      id: "a8",
      estado: "A"
    },
    amigos: []
  },
  
  // Más contenido para probar
  {
    id_api: "9",
    tipo: "serie",
    imagen: "https://www.themoviedb.org/t/p/w600_and_h900_bestv2/4UZzJ65UxR6MKnL6AV3Zl8HGAs.jpg",
    titulo: "The Office",
    descripcion: "Una mirada documental al día a día de los empleados de la sucursal de Scranton de Dunder Mifflin Paper Company.",
    genero: ["Comedia"],
    autor: "Greg Daniels",
    fechaLanzamiento: "2005-03-24",
    temporadas: 9,
    episodios: 201,
    valoracion: 8.9,
    item: {
      id: "a9",
      estado: "P"
    },
    amigos: []
  },
  {
    id_api: "10",
    tipo: "pelicula",
    imagen: "https://www.themoviedb.org/t/p/w600_and_h900_bestv2/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
    titulo: "El Padrino",
    descripcion: "El patriarca envejecido de una dinastía del crimen organizado transfiere el control de su imperio clandestino a su reacio hijo.",
    genero: ["Drama", "Crimen"],
    autor: "Francis Ford Coppola",
    fechaLanzamiento: "1972-03-24",
    duracion: "175",
    valoracion: 9.2,
    item: {
      id: "a10",
      estado: "C"
    },
    amigos: []
  }
];