/**
 * Shared TMDB API response types.
 */

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
}

export interface TVShow {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
}

export interface TrendingItem {
  id: number;
  media_type: "movie" | "tv";
  poster_path: string | null;
  vote_average: number;
  vote_count: number;
  title?: string;
  name?: string;
}

export interface GridItem extends TrendingItem {}

export interface SearchResult {
  id: number;
  media_type: "movie" | "tv" | "person";
  poster_path: string | null;
  vote_average: number;
  vote_count: number;
  title?: string;
  name?: string;
  genre_ids?: number[];
}

export interface MovieDetails extends Movie {
  release_date: string;
  runtime: number | null;
  genres: { id: number; name: string }[];
}

export interface TVShowDetails extends TVShow {
  first_air_date: string;
  number_of_seasons: number;
  genres: { id: number; name: string }[];
  seasons?: TVSeasonSummary[];
}

export interface TVSeasonSummary {
  id: number;
  name: string;
  overview: string | null;
  season_number: number;
  episode_count: number;
  poster_path: string | null;
  air_date: string | null;
  vote_average?: number;
}

export interface TVEpisode {
  id: number;
  name: string;
  overview: string | null;
  episode_number: number;
  season_number: number;
  air_date: string | null;
  runtime: number | null;
  still_path: string | null;
  vote_average: number;
  vote_count: number;
}

export interface TVSeasonDetails {
  id: number;
  name: string;
  overview: string | null;
  season_number: number;
  air_date: string | null;
  poster_path: string | null;
  episodes: TVEpisode[];
}

export interface CreditPerson {
  id: number;
  name: string;
}

export interface Credits {
  directors: CreditPerson[];
  cast: CreditPerson[];
}

export interface Person {
  id: number;
  name: string;
  profile_path: string | null;
  biography: string | null;
  birthday: string | null;
  deathday: string | null;
  place_of_birth: string | null;
  known_for_department: string | null;
}

export interface PersonMovieCredit {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string | null;
  vote_average: number;
  vote_count: number;
  character?: string;
  job?: string;
}

export interface SimpleMediaItem {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
}

/** Utility type for components that accept either Movie or TVShow data for display (e.g. Carousel) */
export interface CarouselCompatibleItem {
  id: number;
  poster_path: string | null;
  vote_average: number;
  vote_count: number;
  title?: string;
  name?: string;
}
