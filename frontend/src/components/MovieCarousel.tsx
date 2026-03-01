import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
            <ChevronLeft size={20} strokeWidth={3} />
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            aria-label="Próximo"
          >
            <ChevronRight size={20} strokeWidth={3} />
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
