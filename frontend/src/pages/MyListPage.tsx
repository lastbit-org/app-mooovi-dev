import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Star, Trash2, CheckCircle2, Eye } from "lucide-react";
import { getPosterUrl } from "../utils/tmdb";
import { useMovieContext, type MovieItem } from "../context/MovieContext";

type SectionId = "movie" | "tv";

// -------------------------------------------------------
// Circular Progress Widget Component
// -------------------------------------------------------
interface ProgressRingProps {
  watched: number;
  total: number;
}

function ProgressRing({ watched, total }: ProgressRingProps) {
  const pct = total === 0 ? 0 : Math.round((watched / total) * 100);
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (pct / 100) * circumference;

  return (
    <div
      className="ml-progress-ring-wrap"
      title={`${watched} assistido(s) de ${total}`}
    >
      <svg
        className="ml-progress-svg"
        viewBox="0 0 100 100"
        width="96"
        height="96"
        aria-label={`${pct}% assistidos`}
      >
        {/* Track */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="8"
        />
        {/* Progress */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform="rotate(-90 50 50)"
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
        {/* Label */}
        <text x="50" y="54" textAnchor="middle" dominantBaseline="auto">
          <tspan className="ml-progress-pct">{pct}</tspan>
          <tspan className="ml-progress-pct-sign" dx="2">
            %
          </tspan>
        </text>
      </svg>
      <div className="ml-progress-legend">
        <span className="ml-progress-legend-watched">
          <CheckCircle2 size={13} />
          {watched} assistidos
        </span>
        <span className="ml-progress-legend-total">
          <Eye size={13} />
          {total - watched} para ver
        </span>
      </div>
    </div>
  );
}

// -------------------------------------------------------
// Main Page Component
// -------------------------------------------------------
export function MyListPage() {
  const { watchLater, watched, removeFromWatchLater, removeFromWatched } =
    useMovieContext();
  const [section, setSection] = useState<SectionId>("movie");

  const filteredWatchLater = useMemo(
    () => watchLater.filter((item) => item.mediaType === section),
    [watchLater, section],
  );

  const filteredWatched = useMemo(
    () => watched.filter((item) => item.mediaType === section),
    [watched, section],
  );

  const totalItemsInSection =
    filteredWatchLater.length + filteredWatched.length;
  const watchedCountInSection = filteredWatched.length;

  const basePath = section === "movie" ? "/movies" : "/tv";

  return (
    <div className="ml-page">
      {/* Page header */}
      <div className="ml-hero">
        <div className="ml-hero-text">
          <h1 className="ml-hero-title">Minha Lista</h1>
          <p className="ml-hero-subtitle">
            Acompanhe o que você quer assistir e o que já viu
          </p>
        </div>

        <ProgressRing
          watched={watchedCountInSection}
          total={totalItemsInSection}
        />
      </div>

      {/* Section toggle */}
      <div className="ml-section-toggle">
        <button
          id="ml-toggle-movies"
          className={`ml-toggle-btn ${section === "movie" ? "ml-toggle-active" : ""}`}
          onClick={() => setSection("movie")}
        >
          📽️ Filmes
        </button>
        <button
          id="ml-toggle-tv"
          className={`ml-toggle-btn ${section === "tv" ? "ml-toggle-active" : ""}`}
          onClick={() => setSection("tv")}
        >
          📺 Séries
        </button>
      </div>

      {/* ── WATCH LATER TABLE ── */}
      <MovieTable
        title="Quero Assistir"
        items={filteredWatchLater}
        basePath={basePath}
        variant="watch-later"
        emptyMsg="Nenhum título na sua lista de desejos."
        onRemove={(id) => removeFromWatchLater(id, section)}
      />

      {/* ── WATCHED TABLE ── */}
      <MovieTable
        title="Já Assisti"
        items={filteredWatched}
        basePath={basePath}
        variant="watched"
        emptyMsg="Você ainda não marcou nenhum título como assistido."
        onRemove={(id) => removeFromWatched(id, section)}
      />
    </div>
  );
}

// -------------------------------------------------------
// Movie Table component
// -------------------------------------------------------
interface MovieTableProps {
  title: string;
  items: MovieItem[];
  basePath: string;
  variant: "watch-later" | "watched";
  emptyMsg: string;
  onRemove: (id: number) => void;
}

function MovieTable({
  title,
  items,
  basePath,
  variant,
  emptyMsg,
  onRemove,
}: MovieTableProps) {
  const isWatched = variant === "watched";

  return (
    <section className="ml-table-section">
      <h2 className="ml-table-heading">
        {isWatched ? (
          <CheckCircle2
            size={20}
            className="ml-table-heading-icon ml-icon-watched"
          />
        ) : (
          <Eye size={20} className="ml-table-heading-icon ml-icon-later" />
        )}
        {title}
        <span className="ml-table-count">{items.length}</span>
      </h2>

      {items.length === 0 ? (
        <div className="ml-empty">
          <p className="ml-empty-text">{emptyMsg}</p>
        </div>
      ) : (
        <div className="ml-table-wrap">
          <table className="ml-table">
            <thead>
              <tr className="ml-table-header-row">
                <th className="ml-th ml-th-rank">#</th>
                <th className="ml-th ml-th-poster">Poster</th>
                <th className="ml-th ml-th-title">Título</th>
                <th className="ml-th ml-th-year">Ano</th>
                <th className="ml-th ml-th-genre">Gênero</th>
                <th className="ml-th ml-th-rating">Avaliação</th>
                <th className="ml-th ml-th-actions"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={item.id} className="ml-table-row">
                  {/* Rank */}
                  <td className="ml-td ml-td-rank">{idx + 1}</td>

                  {/* Poster thumbnail */}
                  <td className="ml-td ml-td-poster">
                    <Link
                      to={`${basePath}/${item.id}`}
                      className="ml-poster-link"
                    >
                      <img
                        src={getPosterUrl(item.poster_path)}
                        alt={item.title ?? item.name}
                        className="ml-poster-thumb"
                        loading="lazy"
                      />
                    </Link>
                  </td>

                  {/* Title */}
                  <td className="ml-td ml-td-title">
                    <Link
                      to={`${basePath}/${item.id}`}
                      className="ml-title-link"
                    >
                      {item.title ?? item.name}
                    </Link>
                    {isWatched && (
                      <span className="ml-watched-badge">
                        <CheckCircle2 size={12} /> Assistido
                      </span>
                    )}
                  </td>

                  {/* Year */}
                  <td className="ml-td ml-td-year">{item.year ?? "—"}</td>

                  {/* Genre */}
                  <td className="ml-td ml-td-genre">{item.genre ?? "—"}</td>

                  {/* Rating */}
                  <td className="ml-td ml-td-rating">
                    <span className="ml-rating">
                      <Star size={14} fill="currentColor" />
                      {item.vote_average.toFixed(1)}
                    </span>
                    <span className="ml-vote-count">
                      {item.vote_count.toLocaleString("pt-BR")}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="ml-td ml-td-actions">
                    <button
                      type="button"
                      className="ml-remove-btn"
                      title="Remover da lista"
                      onClick={() => onRemove(item.id)}
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
