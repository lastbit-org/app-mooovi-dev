import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Search, Menu, X } from "lucide-react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchInput.trim();
    if (q) {
      navigate(`/search?q=${encodeURIComponent(q)}`);
      setIsMenuOpen(false);
    }
  };

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
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
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
        <form className="search-bar" onSubmit={handleSearchSubmit}>
          <Search className="search-icon" size={20} />
          <input
            type="search"
            placeholder="Buscar..."
            aria-label="Buscar"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </form>
        <div className="avatar">U</div>
      </div>
    </header>
  );
}
