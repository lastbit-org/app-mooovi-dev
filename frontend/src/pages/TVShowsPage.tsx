import { useEffect, useState } from 'react'
import { MovieCarousel } from '../components/MovieCarousel'
import { getPopularTVShows, getTrendingTVShows } from '../api/tv'

interface TVShow {
  id: number
  name: string
  poster_path: string | null
  vote_average: number
  vote_count: number
}

export function TVShowsPage() {
  const [trendingShows, setTrendingShows] = useState<TVShow[]>([])
  const [popularShows, setPopularShows] = useState<TVShow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTVShows() {
      try {
        setLoading(true)
        setError(null)
        const [trendingRes, popularRes] = await Promise.all([
          getTrendingTVShows('week'),
          getPopularTVShows(1),
        ])
        setTrendingShows(trendingRes.results ?? [])
        setPopularShows(popularRes.results ?? [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load TV shows')
      } finally {
        setLoading(false)
      }
    }
    fetchTVShows()
  }, [])

  if (loading) {
    return <p className="loading">Loading TV shows...</p>
  }

  if (error) {
    return <p className="error">{error}</p>
  }

  return (
    <>
      <MovieCarousel
        title="Trending TV"
        icon="🔥"
        items={trendingShows}
        mediaType="tv"
      />
      <MovieCarousel
        title="Popular TV Shows"
        icon="🌟"
        items={popularShows}
        mediaType="tv"
      />
    </>
  )
}
