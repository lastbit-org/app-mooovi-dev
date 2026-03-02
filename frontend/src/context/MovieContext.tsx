import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useAuth } from "./AuthContext";

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
  const { user } = useAuth();
  const [watchLater, setWatchLater] = useState<MovieItem[]>([]);
  const [watched, setWatched] = useState<MovieItem[]>([]);

  // Define as chaves baseadas no usuário (ou 'guest' se deslogado)
  const storageSuffix = user ? `_${user.uid}` : "_guest";
  const WL_KEY = `mooovi_watchLater${storageSuffix}`;
  const W_KEY = `mooovi_watched${storageSuffix}`;

  // Carregar do localStorage sempre que o usuário mudar
  useEffect(() => {
    const savedWatchLater = localStorage.getItem(WL_KEY);
    const savedWatched = localStorage.getItem(W_KEY);

    setWatchLater(savedWatchLater ? JSON.parse(savedWatchLater) : []);
    setWatched(savedWatched ? JSON.parse(savedWatched) : []);
  }, [WL_KEY, W_KEY]);

  // Salvar no localStorage sempre que mudar
  useEffect(() => {
    if (WL_KEY) {
      localStorage.setItem(WL_KEY, JSON.stringify(watchLater));
    }
  }, [watchLater, WL_KEY]);

  useEffect(() => {
    if (W_KEY) {
      localStorage.setItem(W_KEY, JSON.stringify(watched));
    }
  }, [watched, W_KEY]);

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
