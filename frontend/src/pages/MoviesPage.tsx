import { useEffect, useState } from "react";
import { MovieCarousel } from "../components/MovieCarousel";
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
  const [loading, setLoading] = useState(true);
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

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Carregando o catálogo de filmes...</p>
      </div>
    );
  }

  if (error) {
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
      </div>
    </div>
  );
}
