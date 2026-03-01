import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

function SearchIcon() {
  return (
    <svg
      className="search-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      width="24"
      height="24"
    >
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      width="24"
      height="24"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="header">
      <Link to="/" className="header-logo" onClick={() => setIsMenuOpen(false)}>
        #M<span>OOO</span>VI
      </Link>

      <button
        className="header-menu-btn"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
      >
        {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
      </button>

      <nav className={`header-nav ${isMenuOpen ? "active" : ""}`}>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "header-nav-link active" : "header-nav-link"
          }
          onClick={() => setIsMenuOpen(false)}
          end
        >
          Início
        </NavLink>
        <NavLink
          to="/tv"
          className={({ isActive }) =>
            isActive ? "header-nav-link active" : "header-nav-link"
          }
          onClick={() => setIsMenuOpen(false)}
        >
          Séries
        </NavLink>
        <NavLink
          to="/movies"
          className={({ isActive }) =>
            isActive ? "header-nav-link active" : "header-nav-link"
          }
          onClick={() => setIsMenuOpen(false)}
        >
          Filmes
        </NavLink>
        <NavLink
          to="/my-list"
          className={({ isActive }) =>
            isActive ? "header-nav-link active" : "header-nav-link"
          }
          onClick={() => setIsMenuOpen(false)}
        >
          Minha Lista
        </NavLink>
      </nav>

      <div className="header-right">
        <div className="search-bar">
          <SearchIcon />
          <input type="search" placeholder="Buscar..." aria-label="Buscar" />
        </div>
        <div className="avatar">U</div>
      </div>
    </header>
  );
}
