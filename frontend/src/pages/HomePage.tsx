import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { MovieCarousel } from "../components/MovieCarousel";
import { MovieCard } from "../components/MovieCard";
import { Hero } from "../components/Hero";
import { getUpcomingMovies, getPopularMovies } from "../api/movies";
import { getTrendingAll } from "../api/trending";
import { parsePageParam } from "../utils/tmdb";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import type { Movie, GridItem, TrendingItem } from "../types/tmdb";

const FEATURED_INTERVAL_MS = 6000;
const FEATURED_MAX_ITEMS = 6;

console.log("HomePage render");

export function HomePage() {
  useDocumentTitle();
  const [searchParams, setSearchParams] = useSearchParams();
  const gridPage = parsePageParam(searchParams.get("page"));

  const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([]);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [featuredPaused, setFeaturedPaused] = useState(false);
  const [gridItems, setGridItems] = useState<GridItem[]>([]);
  const [gridTotalPages, setGridTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [gridLoading, setGridLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMovies() {
      try {
        setLoading(true);
        setError(null);
        const [upcomingRes, popularRes] = await Promise.all([
          getUpcomingMovies(1),
          getPopularMovies(1),
        ]);
        setUpcomingMovies(upcomingRes.results ?? []);
        setPopularMovies(popularRes.results ?? []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Falha ao carregar filmes",
        );
      } finally {
        setLoading(false);
      }
    }
    fetchMovies();
  }, []);

  const featuredItems = popularMovies.slice(0, FEATURED_MAX_ITEMS);
  const [intervalReset, setIntervalReset] = useState(0);

  const goToFeatured = useCallback(
    (index: number) => {
      const len = featuredItems.length;
      setFeaturedIndex(len > 0 ? index % len : 0);
      setIntervalReset((r) => r + 1);
    },
    [featuredItems.length],
  );

  useEffect(() => {
    if (featuredItems.length <= 1 || featuredPaused) return;
    const id = setInterval(() => {
      setFeaturedIndex((i) => (i + 1) % featuredItems.length);
    }, FEATURED_INTERVAL_MS);
    return () => clearInterval(id);
  }, [featuredItems.length, featuredPaused, intervalReset]);

  useEffect(() => {
    async function fetchGridItems() {
      try {
        setGridLoading(true);
        const res = await getTrendingAll("week", gridPage);
        const raw = res?.results ?? [];
        const filtered = raw.filter(
          (r: TrendingItem) =>
            r.media_type === "movie" || r.media_type === "tv",
        );
        setGridItems(filtered);
        setGridTotalPages(Math.min(res.total_pages ?? 1, 500));
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Falha ao carregar conteúdo",
        );
      } finally {
        setGridLoading(false);
      }
    }
    fetchGridItems();
  }, [gridPage]);

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Preparando os melhores títulos...</p>
      </div>
    );
  }

  if (error && popularMovies.length === 0) {
    return <p className="error">❌ {error}</p>;
  }

  const featuredMovie = featuredItems[featuredIndex];

  return (
    <div className="home-page">
      {featuredMovie && (
        <div
          className={`hero-carousel ${featuredPaused ? "hero-carousel-paused" : ""}`}
          onMouseEnter={() => setFeaturedPaused(true)}
          onMouseLeave={() => setFeaturedPaused(false)}
        >
          <Hero
            key={featuredMovie.id}
            movie={featuredMovie}
            mediaType="movie"
          />
          {featuredItems.length > 1 && (
            <div
              className={`hero-dots ${featuredPaused ? "hero-dots-paused" : ""}`}
              role="tablist"
              aria-label="Destaques"
            >
              {featuredItems.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={i === featuredIndex}
                  aria-label={`Destaque ${i + 1} de ${featuredItems.length}`}
                  className={`hero-dot ${i === featuredIndex ? "hero-dot-active" : ""}`}
                  onClick={() => goToFeatured(i)}
                >
                  {i === featuredIndex && (
                    <span className="hero-dot-track">
                      <span
                        key={featuredIndex}
                        className="hero-dot-fill"
                        style={{
                          animationDuration: `${FEATURED_INTERVAL_MS}ms`,
                        }}
                      />
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
      <div className="main">
        <MovieCarousel
          title="Em Breve nos Cinemas"
          icon="✨"
          items={upcomingMovies}
          mediaType="movie"
        />
        <section className="home-grid-section">
          <h2 className="home-grid-title">
            <span className="carousel-icon">🔥</span>
            Em Alta — Filmes e Séries
          </h2>
          {gridLoading ? (
            <div className="home-grid-loading">
              <div className="spinner"></div>
              <p>Carregando...</p>
            </div>
          ) : (
            <>
              <div className="home-grid">
                {gridItems.map((item) => (
                  <MovieCard
                    key={`${item.media_type}-${item.id}`}
                    id={item.id}
                    mediaType={item.media_type}
                    posterPath={item.poster_path}
                    title={item.title ?? item.name ?? ""}
                    rating={item.vote_average}
                    voteCount={item.vote_count}
                  />
                ))}
              </div>
              {gridTotalPages > 1 && (
                <div className="home-grid-pagination">
                  <button
                    type="button"
                    className="home-grid-page-btn"
                    disabled={gridPage <= 1}
                    onClick={() => {
                      const next = gridPage - 1;
                      setSearchParams(next === 1 ? {} : { page: String(next) });
                    }}
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
                    onClick={() =>
                      setSearchParams({ page: String(gridPage + 1) })
                    }
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
