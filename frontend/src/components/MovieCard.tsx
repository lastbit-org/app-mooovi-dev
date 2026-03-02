import { Link } from "react-router-dom";
import { Star, Plus, Check, BookmarkMinus, Trash2 } from "lucide-react";
import { getPosterUrl } from "../utils/tmdb";
import { type MovieItem } from "../context/MovieContext";
import { useWatchActions } from "../hooks/useWatchActions";

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
  const { isInWatchLater, isInWatched, toggleWatchLater, toggleWatched } =
    useWatchActions();

  const isLater = isInWatchLater(id, mediaType);
  const isWatched = isInWatched(id, mediaType);

  const item: MovieItem = {
    id,
    mediaType,
    poster_path: posterPath,
    title: mediaType === "movie" ? title : undefined,
    name: mediaType === "tv" ? title : undefined,
    vote_average: rating,
    vote_count: voteCount,
  };

  const handleWatchLater = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWatchLater(item);
  };

  const handleWatched = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWatched(item);
  };

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

        {isLater && (
          <div className="movie-card-badge badge-later">
            <span>QUERO VER</span>
          </div>
        )}

        {isWatched && (
          <div className="movie-card-badge badge-watched">
            <span>JÁ VI</span>
          </div>
        )}

        <div className="movie-card-actions">
          <button
            type="button"
            className={`movie-card-btn ${isLater ? "active" : ""}`}
            onClick={handleWatchLater}
            aria-label={isLater ? "Remover do Ver depois" : "Ver depois"}
            title={isLater ? "Remover do Ver depois" : "Ver depois"}
          >
            {isLater ? <BookmarkMinus size={18} /> : <Plus size={18} />}
          </button>
          <button
            type="button"
            className={`movie-card-btn ${isWatched ? "active" : ""}`}
            onClick={handleWatched}
            aria-label={isWatched ? "Remover do Já vi" : "Já vi"}
            title={isWatched ? "Remover do Já vi" : "Já vi"}
          >
            {isWatched ? <Trash2 size={16} /> : <Check size={18} />}
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
