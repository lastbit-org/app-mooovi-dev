import { useState } from "react";
import { ChevronDown, ChevronRight, Clock, Star } from "lucide-react";
import { getTVSeasonDetails } from "../api/tv";
import { getPosterUrl, getStillUrl } from "../utils/tmdb";
import type {
  TVSeasonSummary,
  TVSeasonDetails,
  TVEpisode,
} from "../types/tmdb";

interface SeasonsSectionProps {
  seriesId: string;
  seasons: TVSeasonSummary[];
}

function EpisodeRow({ episode }: { episode: TVEpisode }) {
  const airYear = episode.air_date
    ? new Date(episode.air_date).getFullYear()
    : null;

  return (
    <div className="season-episode-row">
      <div className="season-episode-thumb">
        <img
          src={getStillUrl(episode.still_path)}
          alt=""
          loading="lazy"
        />
        <span className="season-episode-num">E{episode.episode_number}</span>
      </div>
      <div className="season-episode-info">
        <div className="season-episode-title">{episode.name}</div>
        <div className="season-episode-meta">
          {airYear && <span>{airYear}</span>}
          {episode.runtime != null && episode.runtime > 0 && (
            <span className="season-episode-runtime">
              <Clock size={12} />
              {episode.runtime} min
            </span>
          )}
          {episode.vote_count > 0 && (
            <span className="season-episode-rating">
              <Star size={12} fill="currentColor" />
              {episode.vote_average.toFixed(1)}
            </span>
          )}
        </div>
        {episode.overview && (
          <p className="season-episode-overview">{episode.overview}</p>
        )}
      </div>
    </div>
  );
}

function SeasonAccordion({
  season,
  seriesId,
}: {
  season: TVSeasonSummary;
  seriesId: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [details, setDetails] = useState<TVSeasonDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleToggle = async () => {
    if (isOpen) {
      setIsOpen(false);
      return;
    }
    if (!details && !loading) {
      setLoading(true);
      setError(null);
      try {
        const data = await getTVSeasonDetails(seriesId, season.season_number);
        setDetails(data);
        setIsOpen(true);
      } catch {
        setError("Falha ao carregar episódios");
      } finally {
        setLoading(false);
      }
    } else {
      setIsOpen(true);
    }
  };

  const episodes = details?.episodes ?? [];
  const displayName =
    season.season_number === 0 ? "Especiais" : `Temporada ${season.season_number}`;

  return (
    <div className="season-accordion">
      <button
        type="button"
        className="season-accordion-header"
        onClick={handleToggle}
        aria-expanded={isOpen}
      >
        <span className="season-accordion-icon">
          {isOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
        </span>
        <div className="season-accordion-poster">
          <img
            src={getPosterUrl(season.poster_path)}
            alt=""
            loading="lazy"
          />
        </div>
        <div className="season-accordion-title">
          <strong>{displayName}</strong>
          {season.name && season.name !== displayName && (
            <span className="season-accordion-subtitle"> — {season.name}</span>
          )}
          <span className="season-accordion-count">
            {season.episode_count} episódio{season.episode_count !== 1 ? "s" : ""}
          </span>
        </div>
      </button>
      {loading && (
        <div className="season-episodes-loading">
          <div className="spinner"></div>
          <p>Carregando episódios...</p>
        </div>
      )}
      {error && <p className="season-episodes-error">{error}</p>}
      {isOpen && details && !loading && (
        <div className="season-episodes-list">
          {episodes.length === 0 ? (
            <p className="season-episodes-empty">Nenhum episódio disponível</p>
          ) : (
            episodes.map((ep) => (
              <EpisodeRow key={ep.id} episode={ep} />
            ))
          )}
        </div>
      )}
    </div>
  );
}

export function SeasonsSection({
  seriesId,
  seasons,
}: SeasonsSectionProps) {
  const validSeasons = (seasons ?? []).filter((s) => s.season_number >= 0);

  if (validSeasons.length === 0) return null;

  const sortedSeasons = [...validSeasons].sort(
    (a, b) => a.season_number - b.season_number,
  );

  return (
    <div className="seasons-section">
      <h3 className="seasons-section-title">Temporadas e episódios</h3>
      <div className="seasons-accordion-list">
        {sortedSeasons.map((season) => (
          <SeasonAccordion
            key={season.id}
            season={season}
            seriesId={seriesId}
          />
        ))}
      </div>
    </div>
  );
}
