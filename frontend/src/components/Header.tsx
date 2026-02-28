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
      <a href="/" className="header-logo">
        I MOVIE <span>IGEEK</span>
      </a>
      <nav className="header-nav">
        <a href="/">Home</a>
        <a href="/">TV Shows</a>
        <a href="/" className="active">
          Movies
        </a>
        <a href="/">New & Popular</a>
        <a href="/">My list</a>
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
