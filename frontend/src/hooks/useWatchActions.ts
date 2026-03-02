import { useMovieContext, type MovieItem } from "../context/MovieContext";

export function useWatchActions() {
  const {
    isInWatchLater,
    isInWatched,
    addToWatchLater,
    removeFromWatchLater,
    addToWatched,
    removeFromWatched,
  } = useMovieContext();

  const toggleWatchLater = (item: MovieItem) => {
    if (isInWatchLater(item.id, item.mediaType)) {
      removeFromWatchLater(item.id, item.mediaType);
    } else {
      addToWatchLater(item);
    }
  };

  const toggleWatched = (item: MovieItem) => {
    if (isInWatched(item.id, item.mediaType)) {
      removeFromWatched(item.id, item.mediaType);
    } else {
      addToWatched(item);
    }
  };

  return {
    isInWatchLater,
    isInWatched,
    toggleWatchLater,
    toggleWatched,
  };
}
