import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { MovieCarousel } from "../components/MovieCarousel";
import { MovieCard } from "../components/MovieCard";
import { getPopularMovies } from "../api/movies";
import { getTrendingAll } from "../api/trending";
import { parsePageParam } from "../utils/tmdb";
import type {
  Movie,
  TrendingItem,
  CarouselCompatibleItem,
} from "../types/tmdb";

export function MoviesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const gridPage = parsePageParam(searchParams.get("page"));

  const [trendingMovies, setTrendingMovies] = useState<
    CarouselCompatibleItem[]
  >([]);
  const [gridMovies, setGridMovies] = useState<Movie[]>([]);
  const [gridTotalPages, setGridTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [gridLoading, setGridLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        setLoading(true);
        setError(null);
        const res = await getTrendingAll("week", 1);
        const raw = (res?.results ?? []) as TrendingItem[];
        const filtered = raw
          .filter((r) => r.media_type === "movie")
          .map(
            ({ id, poster_path, vote_average, vote_count, title, name }) => ({
              id,
              poster_path,
              vote_average,
              vote_count,
              title: title ?? name ?? "",
            }),
          );
        setTrendingMovies(filtered);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Falha ao carregar filmes",
        );
      } finally {
        setLoading(false);
      }
    }
    fetchFeatured();
  }, []);

  useEffect(() => {
    async function fetchGridMovies() {
      try {
        setGridLoading(true);
        const res = await getPopularMovies(gridPage);
        setGridMovies(res.results ?? []);
        setGridTotalPages(Math.min(res.total_pages ?? 1, 500));
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Falha ao carregar filmes",
        );
      } finally {
        setGridLoading(false);
      }
    }
    fetchGridMovies();
  }, [gridPage]);

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Carregando o catálogo de filmes...</p>
      </div>
    );
  }

  if (error && trendingMovies.length === 0) {
    return <p className="error">❌ {error}</p>;
  }

  return (
    <div className="movies-page">
      <header className="page-header">
        <h1 className="page-title">Filmes</h1>
        <p className="page-subtitle">
          Os maiores sucessos e lançamentos do cinema
        </p>
      </header>
      <div className="main">
        <MovieCarousel
          title="Em Destaque"
          icon="🌟"
          items={trendingMovies}
          mediaType="movie"
        />
        <section className="home-grid-section">
          <h2 className="home-grid-title">
            <span className="carousel-icon">🎬</span>
            Catálogo de Filmes
          </h2>
          {gridLoading ? (
            <div className="home-grid-loading">
              <div className="spinner"></div>
              <p>Carregando...</p>
            </div>
          ) : (
            <>
              <div className="home-grid">
                {gridMovies.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    id={movie.id}
                    mediaType="movie"
                    posterPath={movie.poster_path}
                    title={movie.title}
                    rating={movie.vote_average}
                    voteCount={movie.vote_count}
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
