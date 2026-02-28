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
        setError(err instanceof Error ? err.message : "Failed to load movies");
      } finally {
        setLoading(false);
      }
    }
    fetchMovies();
  }, []);

  if (loading) {
    return <p className="loading">Loading movies...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <>
      <MovieCarousel
        title="Coming soon"
        icon="🌟"
        items={upcomingMovies}
        mediaType="movie"
      />
      <MovieCarousel
        title="Trending Movies"
        icon="🔥"
        items={popularMovies}
        mediaType="movie"
      />
    </>
  );
}
