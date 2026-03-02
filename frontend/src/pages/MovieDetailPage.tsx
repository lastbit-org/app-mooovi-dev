import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Star,
  Clock,
  Calendar,
  Film,
  BookmarkPlus,
  Check,
  Trash2,
} from "lucide-react";
import {
  getMovieDetails,
  getMovieCredits,
  getSimilarMovies,
} from "../api/movies";
import { getPosterUrl, getBackdropUrl } from "../utils/tmdb";
import { TrailerSection } from "../components/TrailerSection";
import { MovieCarousel } from "../components/MovieCarousel";
import { type MovieItem } from "../context/MovieContext";
import { useWatchActions } from "../hooks/useWatchActions";
import type {
  MovieDetails,
  Credits,
  CarouselCompatibleItem,
} from "../types/tmdb";

export function MovieDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { isInWatchLater, isInWatched, toggleWatchLater, toggleWatched } =
    useWatchActions();

  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [credits, setCredits] = useState<Credits | null>(null);
  const [similarMovies, setSimilarMovies] = useState<CarouselCompatibleItem[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    async function fetchMovie() {
      try {
        setLoading(true);
        setError(null);
        const data = await getMovieDetails(id!);
        setMovie(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Falha ao carregar filme",
        );
      } finally {
        setLoading(false);
      }
    }
    fetchMovie();
  }, [id]);

  useEffect(() => {
    if (!id) return;
    async function fetchCredits() {
      try {
        const data = await getMovieCredits(id!);
        const directors = ((data.crew ?? []) as { job: string; name: string }[])
          .filter((c) => c.job === "Director")
          .map((c) => c.name);
        const cast = ((data.cast ?? []) as { name: string }[])
          .slice(0, 8)
          .map((c) => c.name);
        setCredits({ directors: [...new Set(directors)], cast });
      } catch {
        setCredits(null);
      }
    }
    fetchCredits();
  }, [id]);

  useEffect(() => {
    if (!id) return;
    const currentId = id;
    async function fetchSimilar() {
      try {
        const data = await getSimilarMovies(currentId);
        const results = (data?.results ?? []) as {
          id: number;
          poster_path: string | null;
          vote_average: number;
          vote_count: number;
          title?: string;
        }[];
        setSimilarMovies(results);
      } catch {
        setSimilarMovies([]);
      }
    }
    fetchSimilar();
  }, [id]);

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Preparando a sala de cinema...</p>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="error">
        <p>🎬 {error ?? "Filme não encontrado"}</p>
      </div>
    );
  }

  const year = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : null;
  const genreNames = movie.genres?.map((g) => g.name).join(", ") ?? "";
  const backdropUrl = getBackdropUrl(movie.backdrop_path);

  const isLater = isInWatchLater(movie.id, "movie");
  const isWatched = isInWatched(movie.id, "movie");

  const movieItem: MovieItem = {
    id: movie.id,
    title: movie.title,
    poster_path: movie.poster_path,
    vote_average: movie.vote_average,
    vote_count: movie.vote_count,
    mediaType: "movie",
    year: year || undefined,
    genre: genreNames,
  };

  const handleWatchLaterClick = () => toggleWatchLater(movieItem);
  const handleWatchedClick = () => toggleWatched(movieItem);

  return (
    <div className="detail-page">
      <div
        className="detail-backdrop"
        style={{
          backgroundImage: backdropUrl ? `url(${backdropUrl})` : "none",
        }}
        aria-hidden
      />
      <div className="detail-content">
        <img
          src={getPosterUrl(movie.poster_path)}
          alt={movie.title}
          className="detail-poster"
          loading="lazy"
        />
        <div className="detail-info">
          <h1 className="detail-title">{movie.title}</h1>

          <div className="detail-meta">
            {year && (
              <div className="detail-meta-item">
                <Calendar size={16} />
                <span>{year}</span>
              </div>
            )}
            {genreNames && (
              <div className="detail-meta-item">
                <Film size={16} />
                <span>{genreNames}</span>
              </div>
            )}
            {movie.runtime && (
              <div className="detail-meta-item">
                <Clock size={16} />
                <span>
                  {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}min
                </span>
              </div>
            )}
          </div>

          <div className="detail-rating">
            <Star size={20} fill="currentColor" />
            <span>{movie.vote_average.toFixed(1)}</span>
            <span className="detail-vote-count">
              • {movie.vote_count.toLocaleString("pt-BR")} avaliações
            </span>
          </div>

          {movie.overview && (
            <p className="detail-overview">{movie.overview}</p>
          )}

          {(credits?.directors?.length || credits?.cast?.length) && (
            <div className="detail-credits">
              {credits.directors.length > 0 && (
                <div className="detail-credits-row">
                  <span className="detail-credits-label">Direção:</span>
                  <span>{credits.directors.join(", ")}</span>
                </div>
              )}
              {credits.cast.length > 0 && (
                <div className="detail-credits-row">
                  <span className="detail-credits-label">Elenco:</span>
                  <span>{credits.cast.join(", ")}</span>
                </div>
              )}
            </div>
          )}

          <div className="detail-actions">
            <button
              type="button"
              className={`detail-btn ${isLater ? "detail-btn-watched" : "detail-btn-watch-later"}`}
              onClick={handleWatchLaterClick}
            >
              {isLater ? (
                <>
                  <Trash2 size={18} /> Remover do Ver Depois
                </>
              ) : (
                <>
                  <BookmarkPlus size={18} /> Ver depois
                </>
              )}
            </button>
            <button
              type="button"
              className={`detail-btn ${isWatched ? "detail-btn-watch-later" : "detail-btn-watched"}`}
              onClick={handleWatchedClick}
            >
              {isWatched ? (
                <>
                  <Trash2 size={18} /> Remover dos Já Vistos
                </>
              ) : (
                <>
                  <Check size={18} /> Já vi
                </>
              )}
            </button>
          </div>
        </div>
        {id && <TrailerSection id={id} mediaType="movie" />}
        {similarMovies.length > 0 && (
          <div className="detail-similar">
            <MovieCarousel
              title="Títulos Similares"
              icon="🎬"
              items={similarMovies}
              mediaType="movie"
            />
          </div>
        )}
      </div>
    </div>
  );
}
