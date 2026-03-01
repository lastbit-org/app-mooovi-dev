import { Link } from "react-router-dom";
import { Play, Info } from "lucide-react";
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
            <Play size={24} fill="currentColor" /> Assistir Agora
          </Link>
          <button type="button" className="hero-btn hero-btn-secondary">
            <Info size={24} /> Detalhes
          </button>
        </div>
      </div>
    </section>
  );
}
