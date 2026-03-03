import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { searchMulti } from "../api/search";
import { getGenreMovieList, getGenreTVList, type Genre } from "../api/genres";
import { MovieCard } from "../components/MovieCard";
import { parsePageParam } from "../utils/tmdb";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import type { SearchResult } from "../types/tmdb";

type MediaTypeFilter = "movie" | "tv";

export function SearchPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryFromUrl = searchParams.get("q") ?? "";
  const currentPage = parsePageParam(searchParams.get("page"));
  const genreFromUrl = searchParams.get("genre");
  const typeFromUrl = searchParams.get("type") as MediaTypeFilter | null;

  const [inputValue, setInputValue] = useState(queryFromUrl);
  const [mediaType, setMediaType] = useState<MediaTypeFilter>(
    typeFromUrl === "tv" ? "tv" : "movie",
  );
  const [selectedGenreId, setSelectedGenreId] = useState<number | "">(
    genreFromUrl ? parseInt(genreFromUrl, 10) || "" : "",
  );
  const [movieGenres, setMovieGenres] = useState<Genre[]>([]);
  const [tvGenres, setTvGenres] = useState<Genre[]>([]);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);

  const searchQuery = queryFromUrl.trim();
  const genres = mediaType === "movie" ? movieGenres : tvGenres;
  const genreIdForFilter =
    selectedGenreId !== "" ? selectedGenreId : null;

  useDocumentTitle(searchQuery ? `Busca: "${searchQuery}"` : "Busca");

  useEffect(() => {
    setInputValue(queryFromUrl);
  }, [queryFromUrl]);

  useEffect(() => {
    if (typeFromUrl === "tv" || typeFromUrl === "movie") {
      setMediaType(typeFromUrl);
    }
  }, [typeFromUrl]);

  useEffect(() => {
    if (genreFromUrl) {
      const id = parseInt(genreFromUrl, 10);
      if (!Number.isNaN(id)) setSelectedGenreId(id);
    } else {
      setSelectedGenreId("");
    }
  }, [genreFromUrl]);

  useEffect(() => {
    async function loadGenres() {
      try {
        const [movieRes, tvRes] = await Promise.all([
          getGenreMovieList(),
          getGenreTVList(),
        ]);
        setMovieGenres(movieRes.genres ?? []);
        setTvGenres(tvRes.genres ?? []);
      } catch {
        setMovieGenres([]);
        setTvGenres([]);
      }
    }
    loadGenres();
  }, []);

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
        const raw = (data?.results ?? []) as SearchResult[];
        let filtered = raw.filter(
          (r) => r.media_type === "movie" || r.media_type === "tv",
        );
        filtered = filtered.filter((r) => r.media_type === mediaType);
        if (genreIdForFilter != null) {
          filtered = filtered.filter(
            (r) =>
              Array.isArray(r.genre_ids) && r.genre_ids.includes(genreIdForFilter),
          );
        }
        setResults(filtered);
        setTotalPages(Math.min(data?.total_pages ?? 1, 500));
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Falha ao buscar resultados",
        );
        setResults([]);
      } finally {
        setLoading(false);
      }
    }

    fetchSearch();
  }, [searchQuery, currentPage, mediaType, genreIdForFilter]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = inputValue.trim();
    if (q) {
      const params: Record<string, string> = { q, type: mediaType };
      if (selectedGenreId !== "") params.genre = String(selectedGenreId);
      setSearchParams(params);
    } else if (selectedGenreId !== "") {
      const path = mediaType === "movie" ? "/movies" : "/tv";
      navigate(`${path}?genre=${selectedGenreId}`);
    }
  };

  const handleExploreGenre = () => {
    if (selectedGenreId !== "") {
      const path = mediaType === "movie" ? "/movies" : "/tv";
      navigate(`${path}?genre=${selectedGenreId}`);
    }
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

  const handleMediaTypeChange = (type: MediaTypeFilter) => {
    setMediaType(type);
    setSelectedGenreId("");
    if (searchQuery) {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.set("type", type);
        next.delete("genre");
        return next;
      });
    }
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
          <div className="search-genre-filter">
            <select
              className="search-genre-select"
              value={selectedGenreId}
              onChange={(e) => {
                const val = e.target.value === "" ? "" : Number(e.target.value);
                setSelectedGenreId(val);
                if (searchQuery) {
                  setSearchParams((prev) => {
                    const next = new URLSearchParams(prev);
                    next.set("type", mediaType);
                    if (val === "") next.delete("genre");
                    else next.set("genre", String(val));
                    return next;
                  });
                }
              }}
              aria-label="Filtrar por gênero"
            >
              <option value="">Todos os gêneros</option>
              {genres.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
            <div className="search-type-toggle">
              <button
                type="button"
                className={`search-type-btn ${mediaType === "movie" ? "active" : ""}`}
                onClick={() => handleMediaTypeChange("movie")}
              >
                Filmes
              </button>
              <button
                type="button"
                className={`search-type-btn ${mediaType === "tv" ? "active" : ""}`}
                onClick={() => handleMediaTypeChange("tv")}
              >
                Séries
              </button>
            </div>
          </div>
          <div className="search-actions">
            <button type="submit" className="search-submit">
              Buscar
            </button>
            {selectedGenreId !== "" && !inputValue.trim() && (
              <button
                type="button"
                className="search-submit search-explore-btn"
                onClick={handleExploreGenre}
              >
                Explorar
              </button>
            )}
          </div>
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
              {genreIdForFilter != null &&
                genres.find((g) => g.id === genreIdForFilter) && (
                  <span className="search-genre-badge">
                    {" "}
                    · {genres.find((g) => g.id === genreIdForFilter)?.name}
                  </span>
                )}
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
