import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { MovieCarousel } from "../components/MovieCarousel";
import { MovieCard } from "../components/MovieCard";
import { getPopularMovies } from "../api/movies";
import { getGenreMovieList } from "../api/genres";
import { getTrendingAll } from "../api/trending";
import { parsePageParam } from "../utils/tmdb";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import type {
  Movie,
  TrendingItem,
  CarouselCompatibleItem,
} from "../types/tmdb";

export function MoviesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const gridPage = parsePageParam(searchParams.get("page"));
  const genreIdParam = searchParams.get("genre");
  const genreId =
    genreIdParam != null && genreIdParam !== ""
      ? parseInt(genreIdParam, 10)
      : null;
  const isValidGenreId =
    genreId !== null && !Number.isNaN(genreId) && genreId >= 1 && genreId <= 999;

  const [genreName, setGenreName] = useState<string | null>(null);
  const [trendingMovies, setTrendingMovies] = useState<
    CarouselCompatibleItem[]
  >([]);
  const [gridMovies, setGridMovies] = useState<Movie[]>([]);
  const [gridTotalPages, setGridTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [gridLoading, setGridLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pageTitle = isValidGenreId && genreName
    ? `Filmes: ${genreName}`
    : "Filmes";
  useDocumentTitle(pageTitle);

  useEffect(() => {
    if (isValidGenreId && genreId !== null) {
      getGenreMovieList().then((res) => {
        const found = res.genres?.find((g) => g.id === genreId);
        setGenreName(found?.name ?? null);
      });
    } else {
      setGenreName(null);
    }
  }, [genreId, isValidGenreId]);

  useEffect(() => {
    if (!isValidGenreId) {
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
    } else {
      setLoading(false);
      setTrendingMovies([]);
    }
  }, [isValidGenreId]);

  useEffect(() => {
    async function fetchGridMovies() {
      try {
        setGridLoading(true);
        const res = await getPopularMovies(
          gridPage,
          isValidGenreId && genreId != null ? genreId : undefined,
        );
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
  }, [gridPage, genreId, isValidGenreId]);

  const setPage = (page: number) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (page === 1) {
        next.delete("page");
      } else {
        next.set("page", String(page));
      }
      return next;
    });
  };

  if (loading && !isValidGenreId) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Carregando o catálogo de filmes...</p>
      </div>
    );
  }

  if (error && trendingMovies.length === 0 && gridMovies.length === 0) {
    return <p className="error">❌ {error}</p>;
  }

  return (
    <div className="movies-page">
      <header className="page-header">
        <h1 className="page-title">{pageTitle}</h1>
        <p className="page-subtitle">
          {isValidGenreId && genreName
            ? `Filmes do gênero ${genreName}`
            : "Os maiores sucessos e lançamentos do cinema"}
        </p>
      </header>
      <div className="main">
        {!isValidGenreId && trendingMovies.length > 0 && (
          <MovieCarousel
            title="Em Destaque"
            icon="🌟"
            items={trendingMovies}
            mediaType="movie"
          />
        )}
        <section className="home-grid-section">
          <h2 className="home-grid-title">
            <span className="carousel-icon">🎬</span>
            {isValidGenreId && genreName
              ? `Filmes: ${genreName}`
              : "Catálogo de Filmes"}
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
                    onClick={() => setPage(gridPage - 1)}
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
                    onClick={() => setPage(gridPage + 1)}
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
