import { useEffect, useState } from 'react';
import { getMovieVideos } from '../api/movies';
import { getTVShowVideos } from '../api/tv';

interface VideoResult {
  key: string;
  type: string;
  site: string;
  name: string;
}

interface TrailerSectionProps {
  id: string;
  mediaType: 'movie' | 'tv';
}

function getTrailerKeys(videos: VideoResult[]): string[] {
  return videos
    .filter(
      (v) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')
    )
    .map((v) => v.key);
}

export function TrailerSection({ id, mediaType }: TrailerSectionProps) {
  const [trailerKeys, setTrailerKeys] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    async function fetchVideos() {
      try {
        setLoading(true);
        const data =
          mediaType === 'movie'
            ? await getMovieVideos(id)
            : await getTVShowVideos(id);
        const results = data?.results ?? [];
        setTrailerKeys(getTrailerKeys(results));
        setCurrentIndex(0);
      } catch {
        setTrailerKeys([]);
      } finally {
        setLoading(false);
      }
    }
    fetchVideos();
  }, [id, mediaType]);

  if (loading || trailerKeys.length === 0) return null;

  const currentKey = trailerKeys[currentIndex];
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < trailerKeys.length - 1;

  return (
    <section className="detail-trailer">
      <div className="detail-trailer-header">
        <h2 className="detail-trailer-title">Trailer</h2>
        <div className="detail-trailer-nav">
          {hasPrev && (
            <button
              type="button"
              className="detail-trailer-nav-btn"
              onClick={() => setCurrentIndex((i) => i - 1)}
              aria-label="Trailer anterior"
            >
              ← Anterior
            </button>
          )}
          {hasNext && (
            <button
              type="button"
              className="detail-trailer-nav-btn"
              onClick={() => setCurrentIndex((i) => i + 1)}
              aria-label="Próximo trailer"
            >
              Próximo →
            </button>
          )}
        </div>
      </div>
      <div className="detail-trailer-wrap">
        <iframe
          key={currentKey}
          src={`https://www.youtube.com/embed/${currentKey}?rel=0`}
          title="Trailer"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="detail-trailer-iframe"
        />
      </div>
    </section>
  );
}
