import { useState } from "react";
import { Link } from "react-router-dom";
import { getPosterUrl } from "../utils/tmdb";

interface ListItem {
  id: number;
  poster_path: string | null;
  vote_average: number;
  vote_count: number;
  title?: string;
  name?: string;
}

type TabId =
  | "watch-later-movies"
  | "watch-later-tv"
  | "watched-movies"
  | "watched-tv";

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: "watch-later-movies", label: "Ver depois", icon: "📽️" },
  { id: "watch-later-tv", label: "Ver depois", icon: "📺" },
  { id: "watched-movies", label: "Já vi", icon: "📽️" },
  { id: "watched-tv", label: "Já vi", icon: "📺" },
];

const WATCH_LATER_MOVIES: ListItem[] = [
  {
    id: 27205,
    title: "Inception",
    poster_path: "/xlaY2zyzMfkhk0HSC5VUwzoZPU1.jpg",
    vote_average: 8.4,
    vote_count: 35000,
  },
  {
    id: 155,
    title: "The Dark Knight",
    poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    vote_average: 9.0,
    vote_count: 28000,
  },
  {
    id: 424,
    title: "Schindler's List",
    poster_path: "/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg",
    vote_average: 8.6,
    vote_count: 15000,
  },
  {
    id: 238,
    title: "The Godfather",
    poster_path: "/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
    vote_average: 8.7,
    vote_count: 19000,
  },
  {
    id: 278,
    title: "The Shawshank Redemption",
    poster_path: "/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
    vote_average: 8.7,
    vote_count: 24000,
  },
  {
    id: 424694,
    title: "Bohemian Rhapsody",
    poster_path: "/lHu1wtNaczFPGFDTrjCSzeLPTKN.jpg",
    vote_average: 8.1,
    vote_count: 12000,
  },
];

const WATCH_LATER_TV: ListItem[] = [
  {
    id: 1399,
    name: "Game of Thrones",
    poster_path: "/u3bZgnGQ9T01sWNhyveQz0wH0Hl.jpg",
    vote_average: 8.4,
    vote_count: 18000,
  },
  {
    id: 60574,
    name: "Peaky Blinders",
    poster_path: "/vUUqzWa2LnHIVqkaKVlVGkVcZIW.jpg",
    vote_average: 8.6,
    vote_count: 8500,
  },
  {
    id: 1396,
    name: "Breaking Bad",
    poster_path: "/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
    vote_average: 8.9,
    vote_count: 12000,
  },
  {
    id: 82856,
    name: "The Mandalorian",
    poster_path: "/eU1i6eHXlzMOlEq0ku1iwzNWqNM.jpg",
    vote_average: 8.5,
    vote_count: 9500,
  },
  {
    id: 66732,
    name: "Stranger Things",
    poster_path: "/49WJfeN0moxb9IPfGn8AIqMGskD.jpg",
    vote_average: 8.6,
    vote_count: 14000,
  },
  {
    id: 94605,
    name: "Arcane",
    poster_path: "/fqldf2t8ztc9aiwn3k6mlX3tvRT.jpg",
    vote_average: 9.0,
    vote_count: 5200,
  },
];

const WATCHED_MOVIES: ListItem[] = [
  {
    id: 550,
    title: "Fight Club",
    poster_path: "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
    vote_average: 8.4,
    vote_count: 26000,
  },
  {
    id: 680,
    title: "Pulp Fiction",
    poster_path: "/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
    vote_average: 8.5,
    vote_count: 25000,
  },
  {
    id: 13,
    title: "Forrest Gump",
    poster_path: "/saHP97rTPS5eLmrLQEcANmKrsFl.jpg",
    vote_average: 8.5,
    vote_count: 24000,
  },
  {
    id: 122,
    title: "The Lord of the Rings: The Return of the King",
    poster_path: "/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg",
    vote_average: 8.5,
    vote_count: 22000,
  },
  {
    id: 120467,
    title: "The Grand Budapest Hotel",
    poster_path: "/nX5XotM9yprCKarRH4fzOq1VM1J.jpg",
    vote_average: 8.1,
    vote_count: 11000,
  },
  {
    id: 19404,
    title: "Dilwale Dulhania Le Jayenge",
    poster_path: "/2gvbZMtV1Zsl7FedJa5ysbpBx2G.jpg",
    vote_average: 8.8,
    vote_count: 3500,
  },
];

const WATCHED_TV: ListItem[] = [
  {
    id: 70785,
    name: "The Witcher",
    poster_path: "/7vjaCdMw15FEbXyLQTVa04URsPm.jpg",
    vote_average: 8.2,
    vote_count: 7500,
  },
  {
    id: 77169,
    name: "Chernobyl",
    poster_path: "/hlLXt2tOPT6RRnjiUmoxyG1LTXR.jpg",
    vote_average: 9.2,
    vote_count: 6500,
  },
  {
    id: 71446,
    name: "Money Heist",
    poster_path: "/reEMJA1uzscCbkpeRJeTT2bjqUp.jpg",
    vote_average: 8.3,
    vote_count: 15000,
  },
  {
    id: 1434,
    name: "Family Guy",
    poster_path: "/xtIFsv0Wpy29Bw7i8gN1ZZiK6LB.jpg",
    vote_average: 7.3,
    vote_count: 4200,
  },
  {
    id: 1438,
    name: "Silicon Valley",
    poster_path: "/4l4rYv1iO1d8fF25vpa8Rxdq2ML.jpg",
    vote_average: 8.2,
    vote_count: 3200,
  },
  {
    id: 1432,
    name: "House",
    poster_path: "/7YW0TfKF0LLhRynLNd2bOe4B0O.jpg",
    vote_average: 8.4,
    vote_count: 5800,
  },
];

const TAB_DATA: Record<
  TabId,
  { items: ListItem[]; mediaType: "movie" | "tv" }
> = {
  "watch-later-movies": { items: WATCH_LATER_MOVIES, mediaType: "movie" },
  "watch-later-tv": { items: WATCH_LATER_TV, mediaType: "tv" },
  "watched-movies": { items: WATCHED_MOVIES, mediaType: "movie" },
  "watched-tv": { items: WATCHED_TV, mediaType: "tv" },
};

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="1rem" height="1rem">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

export function MyListPage() {
  const [activeTab, setActiveTab] = useState<TabId>("watch-later-movies");
  const { items, mediaType } = TAB_DATA[activeTab];
  const basePath = mediaType === "movie" ? "/movies" : "/tv";

  return (
    <div className="mylist-page">
      <header className="mylist-header">
        <h1 className="mylist-title">Minha Lista</h1>
        <p className="mylist-subtitle">
          Personalize sua experiência de streaming
        </p>
      </header>

      <nav className="mylist-tabs" role="tablist">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            className={`mylist-tab ${activeTab === tab.id ? "mylist-tab-active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="mylist-tab-icon" aria-hidden>
              {tab.icon}
            </span>
            <span className="mylist-tab-label">{tab.label}</span>
          </button>
        ))}
      </nav>

      {items.length > 0 ? (
        <div className="mylist-grid">
          {items.map((item) => (
            <div key={item.id} className="mylist-item-card">
              <Link
                to={`${basePath}/${item.id}`}
                className="mylist-card-poster-wrap"
              >
                <img
                  src={getPosterUrl(item.poster_path)}
                  alt={item.title ?? item.name}
                  className="mylist-card-poster"
                  loading="lazy"
                />
                <div className="mylist-card-overlay">
                  <div className="mylist-card-actions">
                    <button
                      type="button"
                      className="mylist-card-btn mylist-card-btn-remove"
                      onClick={(e) => {
                        e.preventDefault();
                        // Ação de remover
                      }}
                    >
                      Remover
                    </button>
                  </div>
                </div>
              </Link>
              <div className="mylist-card-info">
                <Link
                  to={`${basePath}/${item.id}`}
                  className="mylist-card-title"
                >
                  {item.title ?? item.name}
                </Link>
                <div className="mylist-card-meta">
                  <span className="mylist-card-rating">
                    <StarIcon />
                    {item.vote_average.toFixed(1)}
                  </span>
                  <span className="mylist-card-year">
                    {item.vote_count.toLocaleString("pt-BR")} avaliações
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mylist-empty">
          <span className="mylist-empty-icon" aria-hidden>
            🔍
          </span>
          <p className="mylist-empty-text">
            Sua lista está vazia por enquanto.
          </p>
        </div>
      )}
    </div>
  );
}
