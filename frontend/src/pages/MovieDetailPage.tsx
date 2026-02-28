import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getMovieDetails } from '../api/movies'
import { getPosterUrl, getBackdropUrl } from '../utils/tmdb'

interface MovieDetails {
  id: number
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
  vote_count: number
  runtime: number | null
  genres: { id: number; name: string }[]
}

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="1.25rem" height="1.25rem">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  )
}

export function MovieDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [movie, setMovie] = useState<MovieDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    async function fetchMovie() {
      try {
        setLoading(true)
        setError(null)
        const data = await getMovieDetails(id!)
        setMovie(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Falha ao carregar filme')
      } finally {
        setLoading(false)
      }
    }
    fetchMovie()
  }, [id])

  if (loading) {
    return <p className="loading">Carregando filme...</p>
  }

  if (error || !movie) {
    return <p className="error">{error ?? 'Filme não encontrado'}</p>
  }

  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : null
  const genreNames = movie.genres?.map((g) => g.name).join(', ') ?? ''
  const backdropUrl = getBackdropUrl(movie.backdrop_path)

  return (
    <div className="detail-page">
      {backdropUrl && (
        <div
          className="detail-backdrop"
          style={{ backgroundImage: `url(${backdropUrl})` }}
          aria-hidden
        />
      )}
      <div className="detail-content">
        <img
          src={getPosterUrl(movie.poster_path)}
          alt={movie.title}
          className="detail-poster"
        />
        <div className="detail-info">
          <h1 className="detail-title">{movie.title}</h1>
          <div className="detail-meta">
            {year && <span>{year}</span>}
            {genreNames && <span>{genreNames}</span>}
            {movie.runtime && (
              <span>{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}min</span>
            )}
          </div>
          <div className="detail-rating">
            <StarIcon />
            <span>{movie.vote_average.toFixed(1)}</span>
            <span className="detail-vote-count">({movie.vote_count} avaliações)</span>
          </div>
          {movie.overview && (
            <p className="detail-overview">{movie.overview}</p>
          )}
          <div className="detail-actions">
            <button type="button" className="detail-btn detail-btn-watch-later" onClick={() => {}}>
              Ver depois
            </button>
            <button type="button" className="detail-btn detail-btn-watched" onClick={() => {}}>
              Já vi
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
