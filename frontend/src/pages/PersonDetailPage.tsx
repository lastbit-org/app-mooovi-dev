import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Calendar, MapPin, Film, Star } from "lucide-react";
import { getPersonDetails, getPersonMovieCredits } from "../api/person";
import { getProfileUrl, getPosterUrl } from "../utils/tmdb";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import type { Person, PersonMovieCredit } from "../types/tmdb";

export function PersonDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [person, setPerson] = useState<Person | null>(null);
  const [credits, setCredits] = useState<{
    cast: PersonMovieCredit[];
    crew: PersonMovieCredit[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useDocumentTitle(person?.name);

  useEffect(() => {
    if (!id) return;
    async function fetchPerson() {
      try {
        setLoading(true);
        setError(null);
        const [details, movieCredits] = await Promise.all([
          getPersonDetails(id!),
          getPersonMovieCredits(id!),
        ]);
        setPerson(details);
        setCredits({
          cast: (movieCredits.cast ?? []) as PersonMovieCredit[],
          crew: (movieCredits.crew ?? []) as PersonMovieCredit[],
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Falha ao carregar perfil",
        );
      } finally {
        setLoading(false);
      }
    }
    fetchPerson();
  }, [id]);

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Carregando perfil...</p>
      </div>
    );
  }

  if (error || !person) {
    return (
      <div className="error">
        <p>👤 {error ?? "Pessoa não encontrada"}</p>
      </div>
    );
  }

  const birthYear = person.birthday
    ? new Date(person.birthday).getFullYear()
    : null;
  const deathYear = person.deathday
    ? new Date(person.deathday).getFullYear()
    : null;

  // Deduplicate and sort cast by release_date desc
  const castByMovie = new Map<number, PersonMovieCredit>();
  for (const c of credits?.cast ?? []) {
    if (!castByMovie.has(c.id) || (c.release_date && !castByMovie.get(c.id)!.release_date)) {
      castByMovie.set(c.id, c);
    }
  }
  const castList = [...castByMovie.values()].sort((a, b) => {
    const da = a.release_date || "";
    const db = b.release_date || "";
    return db.localeCompare(da);
  });

  // Crew: directors first, then others
  const directors = (credits?.crew ?? []).filter(
    (c) => c.job === "Director",
  );
  const directorByMovie = new Map<number, PersonMovieCredit>();
  for (const c of directors) {
    if (!directorByMovie.has(c.id)) directorByMovie.set(c.id, c);
  }
  const directorList = [...directorByMovie.values()].sort((a, b) => {
    const da = a.release_date || "";
    const db = b.release_date || "";
    return db.localeCompare(da);
  });

  const hasCast = castList.length > 0;
  const hasCrew = directorList.length > 0;

  return (
    <div className="detail-page person-detail-page">
      <div className="detail-content">
        <div className="detail-header person-detail-header">
          <div className="person-profile-wrap">
            <img
              src={getProfileUrl(person.profile_path)}
              alt={person.name}
              className="person-profile-img"
              loading="lazy"
            />
          </div>
          <div className="detail-info person-detail-info">
            <h1 className="detail-title">{person.name}</h1>

            {person.known_for_department && (
              <div className="person-department">
                <Film size={16} />
                <span>{person.known_for_department}</span>
              </div>
            )}

            <div className="person-meta">
              {(birthYear || deathYear) && (
                <div className="detail-meta-item">
                  <Calendar size={16} />
                  <span>
                    {birthYear}
                    {deathYear ? ` – ${deathYear}` : ""}
                  </span>
                </div>
              )}
              {person.place_of_birth && (
                <div className="detail-meta-item">
                  <MapPin size={16} />
                  <span>{person.place_of_birth}</span>
                </div>
              )}
            </div>

            {person.biography && (
              <div className="person-bio">
                <h3>Biografia</h3>
                <p className="detail-overview">{person.biography}</p>
              </div>
            )}
          </div>
        </div>

        {(hasCast || hasCrew) && (
          <div className="person-filmography">
            <h3 className="person-filmography-title">Filmografia</h3>

            {hasCrew && (
              <div className="person-credit-group">
                <h4 className="person-credit-group-title">Como diretor(a)</h4>
                <div className="person-credit-grid">
                  {directorList.map((m) => (
                    <Link
                      key={`crew-${m.id}`}
                      to={`/movies/${m.id}`}
                      className="person-credit-card"
                    >
                      <div className="person-credit-poster">
                        <img
                          src={getPosterUrl(m.poster_path)}
                          alt=""
                          loading="lazy"
                        />
                      </div>
                      <div className="person-credit-info">
                        <span className="person-credit-title">{m.title}</span>
                        {m.release_date && (
                          <span className="person-credit-year">
                            {new Date(m.release_date).getFullYear()}
                          </span>
                        )}
                        {m.vote_count > 0 && (
                          <span className="person-credit-rating">
                            <Star size={12} fill="currentColor" />
                            {m.vote_average.toFixed(1)}
                          </span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {hasCast && (
              <div className="person-credit-group">
                <h4 className="person-credit-group-title">Como ator/atriz</h4>
                <div className="person-credit-grid">
                  {castList.map((m) => (
                    <Link
                      key={`cast-${m.id}`}
                      to={`/movies/${m.id}`}
                      className="person-credit-card"
                    >
                      <div className="person-credit-poster">
                        <img
                          src={getPosterUrl(m.poster_path)}
                          alt=""
                          loading="lazy"
                        />
                      </div>
                      <div className="person-credit-info">
                        <span className="person-credit-title">{m.title}</span>
                        {m.character && (
                          <span className="person-credit-role">
                            {m.character}
                          </span>
                        )}
                        {m.release_date && (
                          <span className="person-credit-year">
                            {new Date(m.release_date).getFullYear()}
                          </span>
                        )}
                        {m.vote_count > 0 && (
                          <span className="person-credit-rating">
                            <Star size={12} fill="currentColor" />
                            {m.vote_average.toFixed(1)}
                          </span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
