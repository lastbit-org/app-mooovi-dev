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

export function Header() {
  return (
    <header className="header">
      <Link to="/" className="header-logo">
        #M<span>OOO</span>VI
      </Link>
      <nav className="header-nav">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "header-nav-link active" : "header-nav-link"
          }
          end
        >
          Home
        </NavLink>
        <NavLink
          to="/tv"
          className={({ isActive }) =>
            isActive ? "header-nav-link active" : "header-nav-link"
          }
        >
          TV Shows
        </NavLink>
        <NavLink
          to="/movies"
          className={({ isActive }) =>
            isActive ? "header-nav-link active" : "header-nav-link"
          }
        >
          Movies
        </NavLink>
        <NavLink
          to="/my-list"
          className={({ isActive }) =>
            isActive ? "header-nav-link active" : "header-nav-link"
          }
        >
          My list
        </NavLink>
      </nav>
      <div className="header-right">
        <div className="search-bar">
          <SearchIcon />
          <input type="search" placeholder="Search" aria-label="Search" />
        </div>
        <div className="avatar">U</div>
      </div>
    </header>
  );
}
