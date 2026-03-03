import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { MovieCarousel } from "../components/MovieCarousel";
import { MovieCard } from "../components/MovieCard";
import { getPopularTVShows, getTrendingTVShows } from "../api/tv";
import { getGenreTVList } from "../api/genres";
import { parsePageParam } from "../utils/tmdb";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import type { TVShow } from "../types/tmdb";

export function TVShowsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const gridPage = parsePageParam(searchParams.get("page"));
  const genreIdParam = searchParams.get("genre");
  const genreId =
    genreIdParam != null && genreIdParam !== ""
      ? parseInt(genreIdParam, 10)
      : null;
  const isValidGenreId =
    genreId !== null && !Number.isNaN(genreId) && genreId >= 1 && genreId <= 999;

  const [genreName, setGenreName] = useState<string | null>(null);
  const [trendingShows, setTrendingShows] = useState<TVShow[]>([]);
  const [gridShows, setGridShows] = useState<TVShow[]>([]);
  const [gridTotalPages, setGridTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [gridLoading, setGridLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pageTitle = isValidGenreId && genreName
    ? `Séries: ${genreName}`
    : "Séries";
  useDocumentTitle(pageTitle);

  useEffect(() => {
    if (isValidGenreId && genreId !== null) {
      getGenreTVList().then((res) => {
        const found = res.genres?.find((g) => g.id === genreId);
        setGenreName(found?.name ?? null);
      });
    } else {
      setGenreName(null);
    }
  }, [genreId, isValidGenreId]);

  useEffect(() => {
    if (!isValidGenreId) {
      async function fetchTVShows() {
        try {
          setLoading(true);
          setError(null);
          const trendingRes = await getTrendingTVShows("week");
          setTrendingShows(trendingRes.results ?? []);
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "Falha ao carregar séries",
          );
        } finally {
          setLoading(false);
        }
      }
      fetchTVShows();
    } else {
      setLoading(false);
      setTrendingShows([]);
    }
  }, [isValidGenreId]);

  useEffect(() => {
    async function fetchGridShows() {
      try {
        setGridLoading(true);
        const res = await getPopularTVShows(
          gridPage,
          isValidGenreId && genreId != null ? genreId : undefined,
        );
        setGridShows(res.results ?? []);
        setGridTotalPages(Math.min(res.total_pages ?? 1, 500));
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Falha ao carregar séries",
        );
      } finally {
        setGridLoading(false);
      }
    }
    fetchGridShows();
  }, [gridPage, genreId, isValidGenreId]);

  const setPage = (page: number) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (page === 1) {
        next.delete("page");
      } else {
        next.set("page", String(page));
      }
      return next;
    });
  };

  if (loading && !isValidGenreId) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Carregando as melhores séries...</p>
      </div>
    );
  }

  if (error && trendingShows.length === 0 && gridShows.length === 0) {
    return <p className="error">❌ {error}</p>;
  }

  return (
    <div className="tv-shows-page">
      <header className="page-header">
        <h1 className="page-title">{pageTitle}</h1>
        <p className="page-subtitle">
          {isValidGenreId && genreName
            ? `Séries do gênero ${genreName}`
            : "As produções mais épicas e maratonáveis"}
        </p>
      </header>
      <div className="main">
        {!isValidGenreId && trendingShows.length > 0 && (
          <MovieCarousel
            title="Bombando na Semana"
            icon="⚡"
            items={trendingShows}
            mediaType="tv"
          />
        )}
        <section className="home-grid-section">
          <h2 className="home-grid-title">
            <span className="carousel-icon">📺</span>
            {isValidGenreId && genreName
              ? `Séries: ${genreName}`
              : "Catálogo de Séries"}
          </h2>
          {gridLoading ? (
            <div className="home-grid-loading">
              <div className="spinner"></div>
              <p>Carregando...</p>
            </div>
          ) : (
            <>
              <div className="home-grid">
                {gridShows.map((show) => (
                  <MovieCard
                    key={show.id}
                    id={show.id}
                    mediaType="tv"
                    posterPath={show.poster_path}
                    title={show.name}
                    rating={show.vote_average}
                    voteCount={show.vote_count}
                  />
                ))}
              </div>
              {gridTotalPages > 1 && (
                <div className="home-grid-pagination">
                  <button
                    type="button"
                    className="home-grid-page-btn"
                    disabled={gridPage <= 1}
                    onClick={() => setPage(gridPage - 1)}
                    aria-label="Página anterior"
                  >
                    Anterior
                  </button>
                  <span className="home-grid-page-info">
                    Página {gridPage} de {gridTotalPages}
                  </span>
                  <button
                    type="button"
                    className="home-grid-page-btn"
                    disabled={gridPage >= gridTotalPages}
                    onClick={() => setPage(gridPage + 1)}
                    aria-label="Próxima página"
                  >
                    Próxima
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}
