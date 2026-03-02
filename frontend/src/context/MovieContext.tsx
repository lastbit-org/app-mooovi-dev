import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

export interface MovieItem {
  id: number;
  poster_path: string | null;
  vote_average: number;
  vote_count: number;
  title?: string;
  name?: string;
  year?: number;
  genre?: string;
  mediaType: "movie" | "tv";
}

interface MovieContextType {
  watchLater: MovieItem[];
  watched: MovieItem[];
  addToWatchLater: (item: MovieItem) => void;
  removeFromWatchLater: (id: number, mediaType: "movie" | "tv") => void;
  addToWatched: (item: MovieItem) => void;
  removeFromWatched: (id: number, mediaType: "movie" | "tv") => void;
  isInWatchLater: (id: number, mediaType: "movie" | "tv") => boolean;
  isInWatched: (id: number, mediaType: "movie" | "tv") => boolean;
}

const MovieContext = createContext<MovieContextType | undefined>(undefined);

export function MovieProvider({ children }: { children: ReactNode }) {
  const [watchLater, setWatchLater] = useState<MovieItem[]>([]);
  const [watched, setWatched] = useState<MovieItem[]>([]);

  // Carregar do localStorage ao iniciar
  useEffect(() => {
    const savedWatchLater = localStorage.getItem("mooovi_watchLater");
    const savedWatched = localStorage.getItem("mooovi_watched");

    if (savedWatchLater) setWatchLater(JSON.parse(savedWatchLater));
    if (savedWatched) setWatched(JSON.parse(savedWatched));
  }, []);

  // Salvar no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem("mooovi_watchLater", JSON.stringify(watchLater));
  }, [watchLater]);

  useEffect(() => {
    localStorage.setItem("mooovi_watched", JSON.stringify(watched));
  }, [watched]);

  const addToWatchLater = (item: MovieItem) => {
    if (!isInWatchLater(item.id, item.mediaType)) {
      setWatchLater((prev) => [...prev, item]);
      // Remove de assistidos se estiver lá (um item não pode estar nos dois ao mesmo tempo)
      removeFromWatched(item.id, item.mediaType);
    }
  };

  const removeFromWatchLater = (id: number, mediaType: "movie" | "tv") => {
    setWatchLater((prev) =>
      prev.filter((i) => !(i.id === id && i.mediaType === mediaType)),
    );
  };

  const addToWatched = (item: MovieItem) => {
    if (!isInWatched(item.id, item.mediaType)) {
      setWatched((prev) => [...prev, item]);
      // Remove de assistir depois se estiver lá
      removeFromWatchLater(item.id, item.mediaType);
    }
  };

  const removeFromWatched = (id: number, mediaType: "movie" | "tv") => {
    setWatched((prev) =>
      prev.filter((i) => !(i.id === id && i.mediaType === mediaType)),
    );
  };

  const isInWatchLater = (id: number, mediaType: "movie" | "tv") => {
    return watchLater.some((i) => i.id === id && i.mediaType === mediaType);
  };

  const isInWatched = (id: number, mediaType: "movie" | "tv") => {
    return watched.some((i) => i.id === id && i.mediaType === mediaType);
  };

  return (
    <MovieContext.Provider
      value={{
        watchLater,
        watched,
        addToWatchLater,
        removeFromWatchLater,
        addToWatched,
        removeFromWatched,
        isInWatchLater,
        isInWatched,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
}

export function useMovieContext() {
  const context = useContext(MovieContext);
  if (context === undefined) {
    throw new Error("useMovieContext must be used within a MovieProvider");
  }
  return context;
}
