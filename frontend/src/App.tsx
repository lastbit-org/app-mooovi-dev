import { useEffect, useState } from 'react'
import { Header } from './components/Header'
import { MovieCarousel } from './components/MovieCarousel'
import { getUpcomingMovies, getPopularMovies } from './api/movies'
import './App.css'

interface Movie {
  id: number
  title: string
  poster_path: string | null
  vote_average: number
  vote_count: number
}

function App() {
  const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([])
  const [popularMovies, setPopularMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchMovies() {
      try {
        setLoading(true)
        setError(null)
        const [upcomingRes, popularRes] = await Promise.all([
          getUpcomingMovies(1),
          getPopularMovies(1),
        ])
        setUpcomingMovies(upcomingRes.results ?? [])
        setPopularMovies(popularRes.results ?? [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load movies')
      } finally {
        setLoading(false)
      }
    }
    fetchMovies()
  }, [])

  if (loading) {
    return (
      <div className="app">
        <Header />
        <main className="main">
          <p className="loading">Loading movies...</p>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="app">
        <Header />
        <main className="main">
          <p className="error">{error}</p>
        </main>
      </div>
    )
  }

  return (
    <div className="app">
      <Header />
      <main className="main">
        <MovieCarousel
          title="Coming soon"
          icon="🌟"
          movies={upcomingMovies}
        />
        <MovieCarousel
          title="Trending Movies"
          icon="🔥"
          movies={popularMovies}
        />
      </main>
    </div>
  )
}

export default App
