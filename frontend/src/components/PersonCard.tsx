import { Link } from "react-router-dom";
import { getProfileUrl } from "../utils/tmdb";

interface PersonCardProps {
  id: number;
  name: string;
  profilePath: string | null;
  knownFor?: string;
}

export function PersonCard({
  id,
  name,
  profilePath,
  knownFor,
}: PersonCardProps) {
  return (
    <Link to={`/person/${id}`} className="person-card">
      <div className="person-card-profile-wrap">
        <img
          src={getProfileUrl(profilePath)}
          alt={name}
          className="person-card-profile"
          loading="lazy"
        />
      </div>
      <h3 className="person-card-name">{name}</h3>
      {knownFor && (
        <p className="person-card-known-for">{knownFor}</p>
      )}
    </Link>
  );
}
