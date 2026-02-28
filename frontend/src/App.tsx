import { Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { HomePage } from "./pages/HomePage";
import { MoviesPage } from "./pages/MoviesPage";
import { TVShowsPage } from "./pages/TVShowsPage";
import { MovieDetailPage } from "./pages/MovieDetailPage";
import { TVShowDetailPage } from "./pages/TVShowDetailPage";
import { MyListPage } from "./pages/MyListPage";
import "./css/App.css";
// test

function App() {
  return (
    <div className="app">
      <Header />
      <main className="main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/movies" element={<MoviesPage />} />
          <Route path="/movies/:id" element={<MovieDetailPage />} />
          <Route path="/tv" element={<TVShowsPage />} />
          <Route path="/tv/:id" element={<TVShowDetailPage />} />
          <Route path="/my-list" element={<MyListPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
