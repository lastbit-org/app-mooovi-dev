import { useEffect, useState } from "react";
import { MovieCarousel } from "../components/MovieCarousel";
import { MovieCard } from "../components/MovieCard";
import { getUpcomingMovies, getPopularMovies } from "../api/movies";

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  vote_count: number;
}

export function MoviesPage() {
  const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([]);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [gridMovies, setGridMovies] = useState<Movie[]>([]);
  const [gridPage, setGridPage] = useState(1);
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

  if (error && popularMovies.length === 0) {
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
          items={popularMovies}
          mediaType="movie"
        />
        <MovieCarousel
          title="Próximas Estreias"
          icon="📅"
          items={upcomingMovies}
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
                    onClick={() => setGridPage((p) => p - 1)}
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
                    onClick={() => setGridPage((p) => p + 1)}
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
