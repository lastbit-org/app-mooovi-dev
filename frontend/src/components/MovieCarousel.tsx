import { useRef } from 'react';
import { MovieCard } from './MovieCard';

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  vote_count: number;
}

interface MovieCarouselProps {
  title: string;
  icon: string;
  movies: Movie[];
}

export function MovieCarousel({ title, icon, movies }: MovieCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = 340;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <section className="carousel-section">
      <div className="carousel-header">
        <h2 className="carousel-title">
          <span className="carousel-icon">{icon}</span>
          {title}
        </h2>
        <div className="carousel-nav">
          <button type="button" onClick={() => scroll('left')} aria-label="Scroll left">
            ←
          </button>
          <button type="button" onClick={() => scroll('right')} aria-label="Scroll right">
            →
          </button>
        </div>
      </div>
      <div className="carousel-list" ref={scrollRef}>
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            posterPath={movie.poster_path}
            title={movie.title}
            rating={movie.vote_average}
            voteCount={movie.vote_count}
          />
        ))}
      </div>
    </section>
  );
}
