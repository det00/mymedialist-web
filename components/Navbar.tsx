// components/Navbar.tsx
"use client"; // Necesario para useState

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header-area header-sticky">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <nav className="main-nav">
              <Link href="/" className="logo">
                <img src="/assets//images/logo.png" alt="Logo" />
              </Link>
              <div className="search-input">
                <form id="search" action="#">
                  <input
                    type="text"
                    placeholder="Buscar"
                    id="searchText"
                    name="searchKeyword"
                  />
                  <i className="fa fa-search"></i>
                </form>
              </div>
              <ul className={`nav ${isMenuOpen ? "d-block" : "d-none"} d-lg-flex`}>
                <li><Link href="/">Home</Link></li>
                <li><Link href="/browse">Descubrir</Link></li>
                <li><Link href="/details">Mi Contenido</Link></li>
                <li>
                  <Link href="/profile">
                    Perfil <img src="/assets/images/profile-header.jpg" alt="Profile" />
                  </Link>
                </li>
              </ul>
              <a className="menu-trigger" onClick={toggleMenu}>
                <span>Menu</span>
              </a>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}