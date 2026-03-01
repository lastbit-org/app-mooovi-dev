import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { MovieCarousel } from "../components/MovieCarousel";
import { MovieCard } from "../components/MovieCard";
import { Hero } from "../components/Hero";
import { getUpcomingMovies, getPopularMovies } from "../api/movies";
import { getTrendingAll } from "../api/trending";

interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
}

interface GridItem {
  id: number;
  media_type: "movie" | "tv";
  poster_path: string | null;
  vote_average: number;
  vote_count: number;
  title?: string;
  name?: string;
}

function parsePageParam(value: string | null): number {
  if (!value) return 1;
  const n = parseInt(value, 10);
  return Number.isNaN(n) || n < 1 ? 1 : Math.min(n, 500);
}

export function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const gridPage = parsePageParam(searchParams.get("page"));

  const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([]);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
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

  useEffect(() => {
    async function fetchGridItems() {
      try {
        setGridLoading(true);
        const res = await getTrendingAll("week", gridPage);
        const raw = res?.results ?? [];
        const filtered = raw.filter(
          (r: GridItem) => r.media_type === "movie" || r.media_type === "tv"
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

  const featuredMovie = popularMovies[0];

  return (
    <div className="home-page">
      {featuredMovie && <Hero movie={featuredMovie} mediaType="movie" />}
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
