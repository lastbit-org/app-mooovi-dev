import { Link } from "react-router-dom";
import { getPosterUrl } from "../utils/tmdb";

interface MovieCardProps {
  id: number;
  mediaType: "movie" | "tv";
  posterPath: string | null;
  title: string;
  rating: number;
  voteCount: number;
}

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

function WatchLaterIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
    </svg>
  );
}

function WatchedIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

export function MovieCard({
  id,
  mediaType,
  posterPath,
  title,
  rating,
  voteCount,
}: MovieCardProps) {
  return (
    <Link
      to={mediaType === "movie" ? `/movies/${id}` : `/tv/${id}`}
      className="movie-card"
    >
      <div className="movie-card-poster-wrap">
        <img
          src={getPosterUrl(posterPath)}
          alt={title}
          className="movie-card-poster"
          loading="lazy"
        />
        <div className="movie-card-actions">
          <button
            type="button"
            className="movie-card-btn"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            aria-label="Ver depois"
          >
            <WatchLaterIcon />
          </button>
          <button
            type="button"
            className="movie-card-btn"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            aria-label="Já vi"
          >
            <WatchedIcon />
          </button>
        </div>
      </div>
      <div className="movie-card-rating">
        <StarIcon />
        <span>{rating.toFixed(1)}</span>
        <span>• {voteCount.toLocaleString("pt-BR")} avaliações</span>
      </div>
      <h3 className="movie-card-title">{title}</h3>
    </Link>
  );
}
