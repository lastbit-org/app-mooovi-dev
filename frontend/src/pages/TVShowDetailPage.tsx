import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTVShowDetails } from "../api/tv";
import { getPosterUrl, getBackdropUrl } from "../utils/tmdb";
import { TrailerSection } from "../components/TrailerSection";

interface TVShowDetails {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  number_of_seasons: number;
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

function TVIcon() {
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
      <rect x="2" y="7" width="20" height="15" rx="2" ry="2" />
      <polyline points="17 2 12 7 7 2" />
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

export function TVShowDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [show, setShow] = useState<TVShowDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    async function fetchShow() {
      try {
        setLoading(true);
        setError(null);
        const data = await getTVShowDetails(id!);
        setShow(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Falha ao carregar série",
        );
      } finally {
        setLoading(false);
      }
    }
    fetchShow();
  }, [id]);

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Sintonizando a série em alta definição...</p>
      </div>
    );
  }

  if (error || !show) {
    return (
      <div className="error">
        <p>📺 {error ?? "Série não encontrada"}</p>
      </div>
    );
  }

  const year = show.first_air_date
    ? new Date(show.first_air_date).getFullYear()
    : null;
  const genreNames = show.genres?.map((g) => g.name).join(", ") ?? "";
  const backdropUrl = getBackdropUrl(show.backdrop_path);

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
          src={getPosterUrl(show.poster_path)}
          alt={show.name}
          className="detail-poster"
          loading="lazy"
        />
        <div className="detail-info">
          <h1 className="detail-title">{show.name}</h1>

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
            {show.number_of_seasons > 0 && (
              <div className="detail-meta-item">
                <TVIcon />
                <span>
                  {show.number_of_seasons} temporada
                  {show.number_of_seasons !== 1 ? "s" : ""}
                </span>
              </div>
            )}
          </div>

          <div className="detail-rating">
            <StarIcon />
            <span>{show.vote_average.toFixed(1)}</span>
            <span className="detail-vote-count">
              • {show.vote_count.toLocaleString("pt-BR")} avaliações
            </span>
          </div>

          {show.overview && <p className="detail-overview">{show.overview}</p>}

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
          <TrailerSection id={id} mediaType="tv" />
        )}
      </div>
    </div>
  );
}
