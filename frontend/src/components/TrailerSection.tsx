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

function getTrailerKey(videos: VideoResult[]): string | null {
  const trailer = videos.find(
    (v) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')
  );
  return trailer?.key ?? null;
}

export function TrailerSection({ id, mediaType }: TrailerSectionProps) {
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
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
        setTrailerKey(getTrailerKey(results));
      } catch {
        setTrailerKey(null);
      } finally {
        setLoading(false);
      }
    }
    fetchVideos();
  }, [id, mediaType]);

  if (loading || !trailerKey) return null;

  return (
    <section className="detail-trailer">
      <h2 className="detail-trailer-title">Trailer</h2>
      <div className="detail-trailer-wrap">
        <iframe
          src={`https://www.youtube.com/embed/${trailerKey}?rel=0`}
          title="Trailer"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="detail-trailer-iframe"
        />
      </div>
    </section>
  );
}
