import { Link } from "react-router-dom";
import { getBackdropUrl } from "../utils/tmdb";

interface HeroProps {
  movie: {
    id: number;
    title?: string;
    name?: string;
    overview: string;
    backdrop_path: string | null;
  };
  mediaType: "movie" | "tv";
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="1.5rem" height="1.5rem">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      width="1.5rem"
      height="1.5rem"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}

export function Hero({ movie, mediaType }: HeroProps) {
  const title = movie.title ?? movie.name;
  const backdropUrl = getBackdropUrl(movie.backdrop_path);

  return (
    <section className="hero">
      <div className="hero-backdrop">
        <img src={backdropUrl} alt="" aria-hidden />
      </div>
      <div className="hero-content">
        <div className="hero-badge">
          <span>🎬</span> EM DESTAQUE HOJE
        </div>
        <h1 className="hero-title">{title}</h1>
        <p className="hero-description">{movie.overview}</p>
        <div className="hero-actions">
          <Link
            to={
              mediaType === "movie" ? `/movies/${movie.id}` : `/tv/${movie.id}`
            }
            className="hero-btn hero-btn-primary"
          >
            <PlayIcon /> Assistir Agora
          </Link>
          <button type="button" className="hero-btn hero-btn-secondary">
            <InfoIcon /> Detalhes
          </button>
        </div>
      </div>
    </section>
  );
}
