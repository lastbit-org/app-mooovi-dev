import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getTVShowDetails } from '../api/tv'
import { getPosterUrl, getBackdropUrl } from '../utils/tmdb'

interface TVShowDetails {
  id: number
  name: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  first_air_date: string
  vote_average: number
  vote_count: number
  number_of_seasons: number
  genres: { id: number; name: string }[]
}

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="1.25rem" height="1.25rem">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  )
}

export function TVShowDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [show, setShow] = useState<TVShowDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    async function fetchShow() {
      try {
        setLoading(true)
        setError(null)
        const data = await getTVShowDetails(id!)
        setShow(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Falha ao carregar série')
      } finally {
        setLoading(false)
      }
    }
    fetchShow()
  }, [id])

  if (loading) {
    return <p className="loading">Carregando série...</p>
  }

  if (error || !show) {
    return <p className="error">{error ?? 'Série não encontrada'}</p>
  }

  const year = show.first_air_date ? new Date(show.first_air_date).getFullYear() : null
  const genreNames = show.genres?.map((g) => g.name).join(', ') ?? ''
  const backdropUrl = getBackdropUrl(show.backdrop_path)

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
          src={getPosterUrl(show.poster_path)}
          alt={show.name}
          className="detail-poster"
        />
        <div className="detail-info">
          <h1 className="detail-title">{show.name}</h1>
          <div className="detail-meta">
            {year && <span>{year}</span>}
            {genreNames && <span>{genreNames}</span>}
            {show.number_of_seasons > 0 && (
              <span>{show.number_of_seasons} temporada{show.number_of_seasons !== 1 ? 's' : ''}</span>
            )}
          </div>
          <div className="detail-rating">
            <StarIcon />
            <span>{show.vote_average.toFixed(1)}</span>
            <span className="detail-vote-count">({show.vote_count} avaliações)</span>
          </div>
          {show.overview && (
            <p className="detail-overview">{show.overview}</p>
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
