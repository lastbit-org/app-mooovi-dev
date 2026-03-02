import { Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { LoadingBar } from "./components/LoadingBar";
import { HomePage } from "./pages/HomePage";
import { MoviesPage } from "./pages/MoviesPage";
import { TVShowsPage } from "./pages/TVShowsPage";
import { MovieDetailPage } from "./pages/MovieDetailPage";
import { TVShowDetailPage } from "./pages/TVShowDetailPage";
import { MyListPage } from "./pages/MyListPage";
import { SearchPage } from "./pages/SearchPage";
import { MovieProvider } from "./context/MovieContext";
import "./css/App.css";

function App() {
  return (
    <MovieProvider>
      <div className="app">
        <LoadingBar />
        <Header />
        <main className="main">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/movies" element={<MoviesPage />} />
            <Route path="/movies/:id" element={<MovieDetailPage />} />
            <Route path="/tv" element={<TVShowsPage />} />
            <Route path="/tv/:id" element={<TVShowDetailPage />} />
            <Route path="/my-list" element={<MyListPage />} />
            <Route path="/search" element={<SearchPage />} />
          </Routes>
        </main>
      </div>
    </MovieProvider>
  );
}

export default App;
