import { useRef } from "react";
import { MovieCard } from "./MovieCard";

export interface CarouselItem {
  id: number;
  poster_path: string | null;
  vote_average: number;
  vote_count: number;
  title?: string;
  name?: string;
}

interface MovieCarouselProps {
  title: string;
  icon: string;
  items: CarouselItem[];
  mediaType: "movie" | "tv";
}

export function MovieCarousel({
  title,
  icon,
  items,
  mediaType,
}: MovieCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = 600;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
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
          <button
            type="button"
            onClick={() => scroll("left")}
            aria-label="Anterior"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              width="1.2rem"
              height="1.2rem"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            aria-label="Próximo"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              width="1.2rem"
              height="1.2rem"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>
      <div className="carousel-list" ref={scrollRef}>
        {items.map((item) => (
          <MovieCard
            key={item.id}
            id={item.id}
            mediaType={mediaType}
            posterPath={item.poster_path}
            title={item.title ?? item.name ?? ""}
            rating={item.vote_average}
            voteCount={item.vote_count}
          />
        ))}
      </div>
    </section>
  );
}
