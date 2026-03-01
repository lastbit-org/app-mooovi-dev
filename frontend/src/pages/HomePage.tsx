import { useEffect, useState } from "react";
import { MovieCarousel } from "../components/MovieCarousel";
import { MovieCard } from "../components/MovieCard";
import { Hero } from "../components/Hero";
import { getUpcomingMovies, getPopularMovies } from "../api/movies";

interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
}

export function HomePage() {
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
        <MovieCarousel
          title="Filmes em Alta"
          icon="🔥"
          items={popularMovies.slice(1)}
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
