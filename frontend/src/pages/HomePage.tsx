import { useEffect, useState } from "react";
import { MovieCarousel } from "../components/MovieCarousel";
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
        <p>Preparando os melhores títulos...</p>
      </div>
    );
  }

  if (error) {
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
      </div>
    </div>
  );
}
