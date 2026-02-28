import { getPosterUrl } from '../utils/tmdb';

interface MovieCardProps {
  posterPath: string | null;
  title: string;
  rating: number;
  voteCount: number;
}

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

export function MovieCard({ posterPath, title, rating, voteCount }: MovieCardProps) {
  return (
    <div className="movie-card">
      <div className="movie-card-poster-wrap">
        <img
          src={getPosterUrl(posterPath)}
          alt={title}
          className="movie-card-poster"
          loading="lazy"
        />
      </div>
      <div className="movie-card-rating">
        <StarIcon />
        <span>{rating.toFixed(1)}</span>
        <span>{voteCount} reviews</span>
      </div>
      <h3 className="movie-card-title">{title}</h3>
    </div>
  );
}
