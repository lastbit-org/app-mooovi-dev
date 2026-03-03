import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
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
  getMovieWatchProviders,
} from "../api/movies";
import { getPosterUrl, getBackdropUrl } from "../utils/tmdb";
import { TrailerSection } from "../components/TrailerSection";
import { WatchProvidersSection } from "../components/WatchProvidersSection";
import { MovieCarousel } from "../components/MovieCarousel";
import { type MovieItem } from "../context/MovieContext";
import { useWatchActions } from "../hooks/useWatchActions";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
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

  useDocumentTitle(movie?.title);

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
        const crew = (data.crew ?? []) as { id: number; job: string; name: string }[];
        const directors = [...new Map(
          crew.filter((c) => c.job === "Director").map((c) => [c.id, { id: c.id, name: c.name }]),
        ).values()];
        const cast = ((data.cast ?? []) as { id: number; name: string }[])
          .slice(0, 8)
          .map((c) => ({ id: c.id, name: c.name }));
        setCredits({ directors, cast });
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
  const genres = movie.genres ?? [];
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
        <div className="detail-header">
          <div className="detail-poster-wrap">
            <img
              src={getPosterUrl(movie.poster_path)}
              alt={movie.title}
              className="detail-poster"
              loading="lazy"
            />
          </div>
          <div className="detail-info">
          <h1 className="detail-title">{movie.title}</h1>

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
                      to={`/movies?genre=${g.id}`}
                      className="genre-chip"
                    >
                      {g.name}
                    </Link>
                  ))}
                </div>
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
                  <span className="detail-credits-links">
                    {credits.directors.map((p, i) => (
                      <span key={p.id}>
                        {i > 0 && ", "}
                        <Link to={`/person/${p.id}`} className="credit-link">
                          {p.name}
                        </Link>
                      </span>
                    ))}
                  </span>
                </div>
              )}
              {credits.cast.length > 0 && (
                <div className="detail-credits-row">
                  <span className="detail-credits-label">Elenco:</span>
                  <span className="detail-credits-links">
                    {credits.cast.map((p, i) => (
                      <span key={p.id}>
                        {i > 0 && ", "}
                        <Link to={`/person/${p.id}`} className="credit-link">
                          {p.name}
                        </Link>
                      </span>
                    ))}
                  </span>
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
        </div>
        {id && (
          <WatchProvidersSection
            id={id}
            fetchProviders={getMovieWatchProviders}
          />
        )}
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
