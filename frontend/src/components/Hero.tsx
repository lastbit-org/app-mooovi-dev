import { Link } from "react-router-dom";
import { Play, Info, Plus, Check, BookmarkMinus, Trash2 } from "lucide-react";
import { getBackdropUrl } from "../utils/tmdb";
import { useMovieContext, type MovieItem } from "../context/MovieContext";

interface HeroProps {
  movie: {
    id: number;
    title?: string;
    name?: string;
    overview: string;
    backdrop_path: string | null;
    poster_path: string | null;
    vote_average: number;
    vote_count: number;
  };
  mediaType: "movie" | "tv";
}

export function Hero({ movie, mediaType }: HeroProps) {
  const {
    isInWatchLater,
    isInWatched,
    addToWatchLater,
    removeFromWatchLater,
    addToWatched,
    removeFromWatched,
  } = useMovieContext();

  const title = movie.title ?? movie.name;
  const backdropUrl = getBackdropUrl(movie.backdrop_path);
  const isLater = isInWatchLater(movie.id, mediaType);
  const isWatched = isInWatched(movie.id, mediaType);

  const handleWatchLater = () => {
    if (isLater) {
      removeFromWatchLater(movie.id, mediaType);
    } else {
      const item: MovieItem = {
        id: movie.id,
        mediaType,
        poster_path: movie.poster_path,
        title: movie.title,
        name: movie.name,
        vote_average: movie.vote_average,
        vote_count: movie.vote_count,
      };
      addToWatchLater(item);
    }
  };

  const handleWatched = () => {
    if (isWatched) {
      removeFromWatched(movie.id, mediaType);
    } else {
      const item: MovieItem = {
        id: movie.id,
        mediaType,
        poster_path: movie.poster_path,
        title: movie.title,
        name: movie.name,
        vote_average: movie.vote_average,
        vote_count: movie.vote_count,
      };
      addToWatched(item);
    }
  };

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

          <button
            type="button"
            className={`hero-btn hero-btn-secondary ${isLater ? "active" : ""}`}
            onClick={handleWatchLater}
            title={isLater ? "Remover do Ver Depois" : "Ver Depois"}
          >
            {isLater ? <BookmarkMinus size={24} /> : <Plus size={24} />}
            <span>{isLater ? "Na Lista" : "Ver Depois"}</span>
          </button>

          <button
            type="button"
            className={`hero-btn hero-btn-secondary ${isWatched ? "active" : ""}`}
            onClick={handleWatched}
            title={isWatched ? "Remover dos Já Vistos" : "Já Vi"}
          >
            {isWatched ? <Trash2 size={24} /> : <Check size={24} />}
            <span>{isWatched ? "Já Vi" : "Marcar como visto"}</span>
          </button>

          <Link
            to={
              mediaType === "movie" ? `/movies/${movie.id}` : `/tv/${movie.id}`
            }
            className="hero-btn hero-btn-secondary"
          >
            <Info size={24} />
            <span>Detalhes</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
