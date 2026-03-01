import { useEffect, useState } from "react";
import { MovieCarousel } from "../components/MovieCarousel";
import { getPopularTVShows, getTrendingTVShows } from "../api/tv";

interface TVShow {
  id: number;
  name: string;
  poster_path: string | null;
  vote_average: number;
  vote_count: number;
}

export function TVShowsPage() {
  const [trendingShows, setTrendingShows] = useState<TVShow[]>([]);
  const [popularShows, setPopularShows] = useState<TVShow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTVShows() {
      try {
        setLoading(true);
        setError(null);
        const [trendingRes, popularRes] = await Promise.all([
          getTrendingTVShows("week"),
          getPopularTVShows(1),
        ]);
        setTrendingShows(trendingRes.results ?? []);
        setPopularShows(popularRes.results ?? []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Falha ao carregar séries",
        );
      } finally {
        setLoading(false);
      }
    }
    fetchTVShows();
  }, []);

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Carregando as melhores séries...</p>
      </div>
    );
  }

  if (error) {
    return <p className="error">❌ {error}</p>;
  }

  return (
    <div className="tv-shows-page">
      <header className="page-header">
        <h1 className="page-title">Séries</h1>
        <p className="page-subtitle">As produções mais épicas e maratonáveis</p>
      </header>
      <div className="main">
        <MovieCarousel
          title="Bombando na Semana"
          icon="⚡"
          items={trendingShows}
          mediaType="tv"
        />
        <MovieCarousel
          title="Séries Populares"
          icon="📺"
          items={popularShows}
          mediaType="tv"
        />
      </div>
    </div>
  );
}
