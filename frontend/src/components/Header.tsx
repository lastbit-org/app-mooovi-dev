import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Search, Menu, X, LogOut, User as UserIcon, Sun, Moon } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export function Header() {
  const { user, loginWithGoogle, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
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
          to="/search?type=person"
          className={({ isActive }) =>
            isActive ? "header-nav-link active" : "header-nav-link"
          }
          onClick={() => setIsMenuOpen(false)}
        >
          Pessoas
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
            placeholder="Buscar filmes, séries..."
            aria-label="Buscar"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </form>

        <button
          type="button"
          className="header-theme-btn"
          onClick={toggleTheme}
          aria-label={theme === "dark" ? "Ativar tema claro" : "Ativar tema escuro"}
          title={theme === "dark" ? "Tema claro" : "Tema escuro"}
        >
          {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <div className="header-user-wrap">
          {user ? (
            <div className="header-user">
              <div className="avatar" title={user.displayName || "Usuário"}>
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="Avatar"
                    className="avatar-img"
                  />
                ) : (
                  <UserIcon size={18} />
                )}
              </div>
              <button className="logout-btn" onClick={logout} title="Sair">
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <button className="login-btn" onClick={loginWithGoogle}>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span>Entrar</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
