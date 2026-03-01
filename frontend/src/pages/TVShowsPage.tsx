import { useEffect, useState } from "react";
import { MovieCarousel } from "../components/MovieCarousel";
import { MovieCard } from "../components/MovieCard";
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
  const [gridShows, setGridShows] = useState<TVShow[]>([]);
  const [gridPage, setGridPage] = useState(1);
  const [gridTotalPages, setGridTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [gridLoading, setGridLoading] = useState(false);
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

  useEffect(() => {
    async function fetchGridShows() {
      try {
        setGridLoading(true);
        const res = await getPopularTVShows(gridPage);
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
  }, [gridPage]);

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Carregando as melhores séries...</p>
      </div>
    );
  }

  if (error && popularShows.length === 0) {
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
        <section className="home-grid-section">
          <h2 className="home-grid-title">
            <span className="carousel-icon">📺</span>
            Catálogo de Séries
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
