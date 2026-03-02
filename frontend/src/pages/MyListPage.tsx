import { useState } from "react";
import { Link } from "react-router-dom";
import { Star, Trash2, CheckCircle2, Eye } from "lucide-react";
import { getPosterUrl } from "../utils/tmdb";

interface ListItem {
  id: number;
  poster_path: string | null;
  vote_average: number;
  vote_count: number;
  title?: string;
  name?: string;
  year?: number;
  genre?: string;
}

type SectionId = "movies" | "tv";

const WATCH_LATER_MOVIES: ListItem[] = [
  {
    id: 27205,
    title: "Inception",
    poster_path: "/xlaY2zyzMfkhk0HSC5VUwzoZPU1.jpg",
    vote_average: 8.4,
    vote_count: 35000,
    year: 2010,
    genre: "Sci-Fi, Thriller",
  },
  {
    id: 155,
    title: "The Dark Knight",
    poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    vote_average: 9.0,
    vote_count: 28000,
    year: 2008,
    genre: "Action, Crime, Drama",
  },
  {
    id: 424,
    title: "Schindler's List",
    poster_path: "/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg",
    vote_average: 8.6,
    vote_count: 15000,
    year: 1993,
    genre: "Drama, History",
  },
  {
    id: 238,
    title: "The Godfather",
    poster_path: "/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
    vote_average: 8.7,
    vote_count: 19000,
    year: 1972,
    genre: "Crime, Drama",
  },
  {
    id: 278,
    title: "The Shawshank Redemption",
    poster_path: "/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
    vote_average: 8.7,
    vote_count: 24000,
    year: 1994,
    genre: "Drama",
  },
  {
    id: 424694,
    title: "Bohemian Rhapsody",
    poster_path: "/lHu1wtNaczFPGFDTrjCSzeLPTKN.jpg",
    vote_average: 8.1,
    vote_count: 12000,
    year: 2018,
    genre: "Music, Drama",
  },
];

const WATCHED_MOVIES: ListItem[] = [
  {
    id: 550,
    title: "Fight Club",
    poster_path: "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
    vote_average: 8.4,
    vote_count: 26000,
    year: 1999,
    genre: "Drama",
  },
  {
    id: 680,
    title: "Pulp Fiction",
    poster_path: "/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
    vote_average: 8.5,
    vote_count: 25000,
    year: 1994,
    genre: "Crime, Drama",
  },
  {
    id: 13,
    title: "Forrest Gump",
    poster_path: "/saHP97rTPS5eLmrLQEcANmKrsFl.jpg",
    vote_average: 8.5,
    vote_count: 24000,
    year: 1994,
    genre: "Drama, Romance",
  },
  {
    id: 122,
    title: "The Lord of the Rings: The Return of the King",
    poster_path: "/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg",
    vote_average: 8.5,
    vote_count: 22000,
    year: 2003,
    genre: "Adventure, Fantasy",
  },
];

const WATCH_LATER_TV: ListItem[] = [
  {
    id: 1399,
    name: "Game of Thrones",
    poster_path: "/u3bZgnGQ9T01sWNhyveQz0wH0Hl.jpg",
    vote_average: 8.4,
    vote_count: 18000,
    year: 2011,
    genre: "Action, Adventure, Drama",
  },
  {
    id: 60574,
    name: "Peaky Blinders",
    poster_path: "/vUUqzWa2LnHIVqkaKVlVGkVcZIW.jpg",
    vote_average: 8.6,
    vote_count: 8500,
    year: 2013,
    genre: "Crime, Drama",
  },
  {
    id: 1396,
    name: "Breaking Bad",
    poster_path: "/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
    vote_average: 8.9,
    vote_count: 12000,
    year: 2008,
    genre: "Crime, Drama, Thriller",
  },
  {
    id: 82856,
    name: "The Mandalorian",
    poster_path: "/sWgBv7LV2PRoQgkxwlibdGXKz1S.jpg",
    vote_average: 8.5,
    vote_count: 9500,
    year: 2019,
    genre: "Action, Adventure, Sci-Fi",
  },
];

const WATCHED_TV: ListItem[] = [
  {
    id: 70785,
    name: "The Witcher",
    poster_path: "/7vjaCdMw15FEbXyLQTVa04URsPm.jpg",
    vote_average: 8.2,
    vote_count: 7500,
    year: 2019,
    genre: "Action, Adventure, Drama",
  },
  {
    id: 77169,
    name: "Chernobyl",
    poster_path: "/6POBWybSBDBKjSs1VAQcnQC1qyt.jpg",
    vote_average: 9.2,
    vote_count: 6500,
    year: 2019,
    genre: "Drama, History, Thriller",
  },
  {
    id: 71446,
    name: "Money Heist",
    poster_path: "/reEMJA1uzscCbkpeRJeTT2bjqUp.jpg",
    vote_average: 8.3,
    vote_count: 15000,
    year: 2017,
    genre: "Action, Crime, Mystery",
  },
];

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
        {/* Number + % side by side, sharing the same text baseline */}
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
  const [section, setSection] = useState<SectionId>("movies");

  const watchLaterList =
    section === "movies" ? WATCH_LATER_MOVIES : WATCH_LATER_TV;
  const watchedList = section === "movies" ? WATCHED_MOVIES : WATCHED_TV;
  const basePath = section === "movies" ? "/movies" : "/tv";

  const totalItems = watchLaterList.length + watchedList.length;
  const watchedCount = watchedList.length;

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

        <ProgressRing watched={watchedCount} total={totalItems} />
      </div>

      {/* Section toggle */}
      <div className="ml-section-toggle">
        <button
          id="ml-toggle-movies"
          className={`ml-toggle-btn ${section === "movies" ? "ml-toggle-active" : ""}`}
          onClick={() => setSection("movies")}
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
        items={watchLaterList}
        basePath={basePath}
        variant="watch-later"
        emptyMsg="Nenhum título na sua lista de desejos."
      />

      {/* ── WATCHED TABLE ── */}
      <MovieTable
        title="Já Assisti"
        items={watchedList}
        basePath={basePath}
        variant="watched"
        emptyMsg="Você ainda não marcou nenhum título como assistido."
      />
    </div>
  );
}

// -------------------------------------------------------
// Movie Table component
// -------------------------------------------------------
interface MovieTableProps {
  title: string;
  items: ListItem[];
  basePath: string;
  variant: "watch-later" | "watched";
  emptyMsg: string;
}

function MovieTable({
  title,
  items,
  basePath,
  variant,
  emptyMsg,
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
                      onClick={() => {
                        /* TODO: integrate with real state */
                      }}
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
