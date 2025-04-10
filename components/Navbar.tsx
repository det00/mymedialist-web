"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import api from "@/app/lib/axios";
import { motion } from "framer-motion";
import Image from "next/image";
import type { Buscar } from "@/app/types";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [busqueda, setBusqueda] = useState<string>("");
  const [tipo, setTipo] = useState<string>("P");
  const [showResultados, setShowResultados] = useState<boolean>(false);
  const [resultados, setResultados] = useState<Buscar[]>([]);
  const [token, setToken] = useState<string | null>("");

  const search = useCallback(async () => {
    const res = await api.get("/buscar", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { busqueda: busqueda, tipo: tipo },
    });
    console.log(res);

    setResultados(res.data);
  }, [busqueda, tipo, token]);

  const toggleMenu = (): void => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleShowLayout = (): void => {
    setShowResultados(false);
  };

  const router = useRouter();
  const handleEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      setShowResultados(false);
      router.push(
        `/busqueda?busqueda=${encodeURIComponent(
          busqueda
        )}&tipo=${encodeURIComponent(tipo)}`
      );
    }
  };

  const getTipoUrl = () => {
    switch (tipo) {
      case "P": {
        return "pelicula";
      }
      case "V": {
        return "videojuego";
      }
      case "L": {
        return "libro";
      }
      case "S": {
        return "serie";
      }
    }
  };

  const handleSearhItem = () => {
    setShowResultados(false);
    setBusqueda("");
    setResultados([]);
  };

  useEffect(() => {
    if (busqueda.length > 2) {
      search();
    }
  }, [busqueda, search]);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  return (
    <header className="header-area header-sticky">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <nav className="main-nav">
              <Link href="/home" className="logo">
                MYMEDIALIST(logo a futuro)
              </Link>
              <div className="search-input position-relative z-1000">
                <form id="search">
                  <input
                    className="search"
                    value={busqueda}
                    type="text"
                    placeholder="Buscar"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setBusqueda(e.target.value)
                    }
                    onPointerUp={() => setShowResultados(true)}
                    onKeyDown={handleEnter}
                  />
                  <i className="fa fa-search" />
                </form>
              </div>
              <ul
                className={`nav ${isMenuOpen ? "d-block" : "d-none"} d-lg-flex`}
              >
                <li>
                  <Link href="/home">Home</Link>
                </li>
                <li>
                  <Link href="/descubrir">Descubrir</Link>
                </li>
                <li>
                  <Link href="/contenido">Mi Contenido</Link>
                </li>
                <li>
                  <Link href="/profile">
                    Perfil
                    <Image
                      width={30}
                      height={30}
                      src="/assets/images/profile-header.jpg"
                      alt="Profile"
                    />
                  </Link>
                </li>
              </ul>
              {/* biome-ignore lint/a11y/useValidAnchor: <explanation> */}
              <a className="menu-trigger" onClick={toggleMenu}>
                <span>Menu</span>
              </a>
            </nav>
          </div>
        </div>
      </div>
      {showResultados && (
        <>
          <div
            className="position-fixed top-0 start-0 w-100 h-100 bg-black bg-opacity-50 z-2"
            onClick={handleShowLayout}
          />
          <motion.div
            className="container d-flex justify-content-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <div className="bg-2 p-4 rounded-4 shadow-lg position-relative z-2 mt-0 w-50">
              <div className="col-lg-12">
                <div className="heading-section mb-4">
                  <span
                    className={`badge rounded-pill p-2 m-1 fw-normal ${
                      tipo === "P" ? "text-bg-pink" : "btn btn-secondary"
                    }`}
                    onClick={() => setTipo("P")}
                  >
                    Películas
                  </span>
                  <span
                    className={`badge rounded-pill p-2 m-1 fw-normal ${
                      tipo === "L" ? "text-bg-pink" : "btn btn-secondary"
                    }`}
                    onClick={() => setTipo("L")}
                  >
                    Libros
                  </span>
                  <span
                    className={`badge rounded-pill p-2 m-1 fw-normal ${
                      tipo === "V" ? "text-bg-pink" : "btn btn-secondary"
                    }`}
                    onClick={() => setTipo("V")}
                  >
                    Juegos
                  </span>
                  <span
                    className={`badge rounded-pill p-2 m-1 fw-normal ${
                      tipo === "S" ? "text-bg-pink" : "btn btn-secondary"
                    }`}
                    onClick={() => setTipo("S")}
                  >
                    Series
                  </span>
                </div>
                <div
                  className="d-grid gap-3"
                  style={{
                    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                  }}
                >
                  {/* <div className="row"> */}
                  {resultados.slice(0, 6).map((item) => {
                    return (
                      <>
                        <Link
                          key={item.id_api}
                          href={`/${getTipoUrl()}/${item.id_api}`}
                          onClick={handleSearhItem}
                        >
                          <div
                            className="col-lg-12 shadow-lg bg-search rounded-4 p-2 shadow cursor-pointer"
                            style={{
                              transition:
                                "transform 0.3s ease, box-shadow 0.3s ease", // Transición suave
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform =
                                "translateY(-10px)"; // Mueve la tarjeta hacia arriba
                              e.currentTarget.style.boxShadow =
                                "0 10px 20px rgba(0, 0, 0, 0.3)"; // Aumenta la sombra
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = "translateY(0)"; // Vuelve a la posición original
                              e.currentTarget.style.boxShadow =
                                "0 0.5rem 1rem rgba(0, 0, 0, 0.15)"; // Sombra original de shadow-lg
                            }}
                          >
                            <Image
                              src={item.imagen}
                              alt={item.titulo}
                              width={1000}
                              height={100}
                              className="img-fluid rounded-4"
                            />
                            <div className="text-secondary pb-10 fw-normal text-justify">
                              {item.titulo}
                            </div>
                          </div>
                        </Link>
                      </>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </header>
  );
}
