import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Star,
  Calendar,
  Tv,
  Film,
  BookmarkPlus,
  Check,
  Trash2,
} from "lucide-react";
import {
  getTVShowDetails,
  getTVShowCredits,
  getSimilarTVShows,
} from "../api/tv";
import { getPosterUrl, getBackdropUrl } from "../utils/tmdb";
import { TrailerSection } from "../components/TrailerSection";
import { MovieCarousel } from "../components/MovieCarousel";
import { type MovieItem } from "../context/MovieContext";
import { useWatchActions } from "../hooks/useWatchActions";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import type {
  TVShowDetails,
  Credits,
  CarouselCompatibleItem,
} from "../types/tmdb";

export function TVShowDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { isInWatchLater, isInWatched, toggleWatchLater, toggleWatched } =
    useWatchActions();

  const [show, setShow] = useState<TVShowDetails | null>(null);
  const [credits, setCredits] = useState<Credits | null>(null);
  const [similarShows, setSimilarShows] = useState<CarouselCompatibleItem[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useDocumentTitle(show?.name);

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

  useEffect(() => {
    if (!id) return;
    const currentId = id;
    async function fetchSimilar() {
      try {
        const data = await getSimilarTVShows(currentId);
        const results = (data?.results ?? []) as {
          id: number;
          poster_path: string | null;
          vote_average: number;
          vote_count: number;
          title?: string;
          name?: string;
        }[];
        setSimilarShows(results);
      } catch {
        setSimilarShows([]);
      }
    }
    fetchSimilar();
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
  const genres = show.genres ?? [];
  const backdropUrl = getBackdropUrl(show.backdrop_path);

  const isLater = isInWatchLater(show.id, "tv");
  const isWatched = isInWatched(show.id, "tv");

  const showItem: MovieItem = {
    id: show.id,
    name: show.name,
    poster_path: show.poster_path,
    vote_average: show.vote_average,
    vote_count: show.vote_count,
    year: year || undefined,
    genre: genreNames,
    mediaType: "tv",
  };

  const handleWatchLaterClick = () => toggleWatchLater(showItem);
  const handleWatchedClick = () => toggleWatched(showItem);

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
            {genres.length > 0 && (
              <div className="detail-meta-item detail-meta-genres">
                <Film size={16} />
                <div className="genre-chips">
                  {genres.map((g) => (
                    <Link
                      key={g.id}
                      to={`/tv?genre=${g.id}`}
                      className="genre-chip"
                    >
                      {g.name}
                    </Link>
                  ))}
                </div>
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
        {id && <TrailerSection id={id} mediaType="tv" />}
        {similarShows.length > 0 && (
          <div className="detail-similar">
            <MovieCarousel
              title="Séries Similares"
              icon="📺"
              items={similarShows}
              mediaType="tv"
            />
          </div>
        )}
      </div>
    </div>
  );
}
