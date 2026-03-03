import { Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { LoadingBar } from "./components/LoadingBar";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { HomePage } from "./pages/HomePage";
import { MoviesPage } from "./pages/MoviesPage";
import { TVShowsPage } from "./pages/TVShowsPage";
import { MovieDetailPage } from "./pages/MovieDetailPage";
import { TVShowDetailPage } from "./pages/TVShowDetailPage";
import { PersonDetailPage } from "./pages/PersonDetailPage";
import { MyListPage } from "./pages/MyListPage";
import { SearchPage } from "./pages/SearchPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { MovieProvider } from "./context/MovieContext";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import "./css/App.css";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
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
              <Route path="/person/:id" element={<PersonDetailPage />} />
              <Route
                path="/my-list"
                element={
                  <ProtectedRoute>
                    <MyListPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/search" element={<SearchPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
        </div>
        </MovieProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
