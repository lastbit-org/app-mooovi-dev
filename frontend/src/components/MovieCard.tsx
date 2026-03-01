import { Link } from "react-router-dom";
import { Star, Plus, Check } from "lucide-react";
import { getPosterUrl } from "../utils/tmdb";

interface MovieCardProps {
  id: number;
  mediaType: "movie" | "tv";
  posterPath: string | null;
  title: string;
  rating: number;
  voteCount: number;
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
            <Plus size={18} />
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
            <Check size={18} />
          </button>
        </div>
      </div>
      <div className="movie-card-rating">
        <Star size={16} fill="currentColor" />
        <span>{rating.toFixed(1)}</span>
        <span>• {voteCount.toLocaleString("pt-BR")} avaliações</span>
      </div>
      <h3 className="movie-card-title">{title}</h3>
    </Link>
  );
}
