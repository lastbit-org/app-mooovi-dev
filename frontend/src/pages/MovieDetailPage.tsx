import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMovieDetails, getMovieCredits } from "../api/movies";
import { getPosterUrl, getBackdropUrl } from "../utils/tmdb";
import { TrailerSection } from "../components/TrailerSection";

interface MovieDetails {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  runtime: number | null;
  genres: { id: number; name: string }[];
}

function StarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      width="1.25rem"
      height="1.25rem"
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      width="1rem"
      height="1rem"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      width="1rem"
      height="1rem"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function FilmIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      width="1rem"
      height="1rem"
    >
      <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
      <line x1="7" y1="2" x2="7" y2="22" />
      <line x1="17" y1="2" x2="17" y2="22" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <line x1="2" y1="7" x2="7" y2="7" />
      <line x1="2" y1="17" x2="7" y2="17" />
      <line x1="17" y1="17" x2="22" y2="17" />
      <line x1="17" y1="7" x2="22" y2="7" />
    </svg>
  );
}

interface Credits {
  directors: string[];
  cast: string[];
}

export function MovieDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [credits, setCredits] = useState<Credits | null>(null);
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
                <CalendarIcon />
                <span>{year}</span>
              </div>
            )}
            {genreNames && (
              <div className="detail-meta-item">
                <FilmIcon />
                <span>{genreNames}</span>
              </div>
            )}
            {movie.runtime && (
              <div className="detail-meta-item">
                <ClockIcon />
                <span>
                  {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}min
                </span>
              </div>
            )}
          </div>

          <div className="detail-rating">
            <StarIcon />
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
              className="detail-btn detail-btn-watch-later"
              onClick={() => {}}
            >
              <span>📌</span> Ver depois
            </button>
            <button
              type="button"
              className="detail-btn detail-btn-watched"
              onClick={() => {}}
            >
              <span>✅</span> Já vi
            </button>
          </div>
        </div>
        {id && (
          <TrailerSection id={id} mediaType="movie" />
        )}
      </div>
    </div>
  );
}
