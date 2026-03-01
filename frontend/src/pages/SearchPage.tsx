import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { searchMulti } from "../api/search";
import { MovieCard } from "../components/MovieCard";

interface SearchResult {
  id: number;
  media_type: "movie" | "tv" | "person";
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

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryFromUrl = searchParams.get("q") ?? "";
  const currentPage = parsePageParam(searchParams.get("page"));
  const [inputValue, setInputValue] = useState(queryFromUrl);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);

  const searchQuery = queryFromUrl.trim();

  useEffect(() => {
    setInputValue(queryFromUrl);
  }, [queryFromUrl]);

  useEffect(() => {
    if (!searchQuery) {
      setResults([]);
      setLoading(false);
      return;
    }

    async function fetchSearch() {
      try {
        setLoading(true);
        setError(null);
        const data = await searchMulti(searchQuery, currentPage);
        const raw = data?.results ?? [];
        const filtered = raw.filter(
          (r: SearchResult) => r.media_type === "movie" || r.media_type === "tv"
        );
        setResults(filtered);
        setTotalPages(Math.min(data?.total_pages ?? 1, 500));
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Falha ao buscar resultados"
        );
        setResults([]);
      } finally {
        setLoading(false);
      }
    }

    fetchSearch();
  }, [searchQuery, currentPage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = inputValue.trim();
    setSearchParams(q ? { q } : {});
  };

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

  const mediaItems = results.map((item) => ({
    id: item.id,
    mediaType: item.media_type as "movie" | "tv",
    posterPath: item.poster_path,
    title: item.title ?? item.name ?? "",
    rating: item.vote_average,
    voteCount: item.vote_count,
  }));

  return (
    <div className="search-page">
      <header className="search-header">
        <h1 className="search-title">Buscar</h1>
        <form className="search-form" onSubmit={handleSubmit}>
          <div className="search-input-wrap">
            <Search size={20} />
            <input
              type="search"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Filmes, séries..."
              className="search-input"
              aria-label="Buscar filmes e séries"
              autoFocus
            />
          </div>
          <button type="submit" className="search-submit">
            Buscar
          </button>
        </form>
      </header>

      <div className="search-content">
        {!searchQuery && (
          <div className="search-empty-state">
            <Search size={20} />
            <p>Digite algo para buscar filmes e séries</p>
          </div>
        )}

        {searchQuery && loading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Buscando resultados...</p>
          </div>
        )}

        {searchQuery && !loading && error && (
          <p className="error">❌ {error}</p>
        )}

        {searchQuery && !loading && !error && results.length === 0 && (
          <div className="search-empty-state">
            <p>Nenhum resultado encontrado para &quot;{searchQuery}&quot;</p>
          </div>
        )}

        {searchQuery && !loading && !error && results.length > 0 && (
          <>
            <p className="search-results-count">
              {results.length} resultado{results.length !== 1 ? "s" : ""} para
              &quot;{searchQuery}&quot;
            </p>
            <div className="search-grid">
              {mediaItems.map((item) => (
                <MovieCard
                  key={`${item.mediaType}-${item.id}`}
                  id={item.id}
                  mediaType={item.mediaType}
                  posterPath={item.posterPath}
                  title={item.title}
                  rating={item.rating}
                  voteCount={item.voteCount}
                />
              ))}
            </div>
            {totalPages > 1 && (
              <div className="search-pagination">
                <button
                  type="button"
                  className="search-page-btn"
                  disabled={currentPage <= 1}
                  onClick={() => setPage(currentPage - 1)}
                >
                  Anterior
                </button>
                <span className="search-page-info">
                  Página {currentPage} de {totalPages}
                </span>
                <button
                  type="button"
                  className="search-page-btn"
                  disabled={currentPage >= totalPages}
                  onClick={() => setPage(currentPage + 1)}
                >
                  Próxima
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
