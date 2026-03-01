import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Star, Calendar, Tv, Film, BookmarkPlus, Check } from "lucide-react";
import { getTVShowDetails, getTVShowCredits } from "../api/tv";
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

interface Credits {
  directors: string[];
  cast: string[];
}

export function TVShowDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [show, setShow] = useState<TVShowDetails | null>(null);
  const [credits, setCredits] = useState<Credits | null>(null);
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

  useEffect(() => {
    if (!id) return;
    async function fetchCredits() {
      try {
        const data = await getTVShowCredits(id!);
        const crew = (data.crew ?? []) as { job: string; name: string }[];
        let directors = crew
          .filter((c) => c.job === "Director")
          .map((c) => c.name);
        if (directors.length === 0) {
          directors = crew
            .filter((c) => c.job === "Executive Producer")
            .map((c) => c.name);
        }
        if (directors.length === 0) {
          directors = crew
            .filter((c) => c.job === "Creator")
            .map((c) => c.name);
        }
        const cast = ((data.cast ?? []) as { name: string }[])
          .slice(0, 8)
          .map((c) => c.name);
        setCredits({
          directors: [...new Set(directors)],
          cast,
        });
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
            {show.number_of_seasons > 0 && (
              <div className="detail-meta-item">
                <Tv size={16} />
                <span>
                  {show.number_of_seasons} temporada
                  {show.number_of_seasons !== 1 ? "s" : ""}
                </span>
              </div>
            )}
          </div>

          <div className="detail-rating">
            <Star size={20} fill="currentColor" />
            <span>{show.vote_average.toFixed(1)}</span>
            <span className="detail-vote-count">
              • {show.vote_count.toLocaleString("pt-BR")} avaliações
            </span>
          </div>

          {show.overview && <p className="detail-overview">{show.overview}</p>}

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
              <BookmarkPlus size={18} /> Ver depois
            </button>
            <button
              type="button"
              className="detail-btn detail-btn-watched"
              onClick={() => {}}
            >
              <Check size={18} /> Já vi
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
