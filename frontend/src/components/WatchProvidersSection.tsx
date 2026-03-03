import { useEffect, useState } from "react";
import { Play } from "lucide-react";
import { getProviderLogoUrl } from "../utils/tmdb";

interface WatchProvider {
  logo_path: string | null;
  provider_id: number;
  provider_name: string;
  display_priority?: number;
}

interface CountryProviders {
  link?: string;
  flatrate?: WatchProvider[];
  rent?: WatchProvider[];
  buy?: WatchProvider[];
  ads?: WatchProvider[];
}

interface WatchProvidersData {
  id: number;
  results?: Record<string, CountryProviders>;
}

interface WatchProvidersSectionProps {
  id: string;
  fetchProviders: (id: string) => Promise<WatchProvidersData>;
}

const PREFERRED_COUNTRIES = ["BR", "US", "PT"];

function ProviderLogos({
  providers,
  label,
}: {
  providers: WatchProvider[];
  label: string;
}) {
  if (providers.length === 0) return null;
  return (
    <div className="watch-providers-group">
      <span className="watch-providers-label">{label}</span>
      <div className="watch-providers-logos">
        {providers
          .sort((a, b) => (a.display_priority ?? 0) - (b.display_priority ?? 0))
          .map((p) => (
            <div
              key={p.provider_id}
              className="watch-provider-item"
              title={p.provider_name}
            >
              {p.logo_path ? (
                <img
                  src={getProviderLogoUrl(p.logo_path)}
                  alt={p.provider_name}
                  loading="lazy"
                />
              ) : (
                <span className="watch-provider-fallback">
                  {p.provider_name.charAt(0)}
                </span>
              )}
              <span className="watch-provider-name">{p.provider_name}</span>
            </div>
          ))}
      </div>
    </div>
  );
}

export function WatchProvidersSection({
  id,
  fetchProviders,
}: WatchProvidersSectionProps) {
  const [data, setData] = useState<WatchProvidersData | null>(null);
  const [link, setLink] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    fetchProviders(id).then((res) => {
      if (cancelled) return;
      setData(res);
      const countryData = PREFERRED_COUNTRIES.reduce<CountryProviders | null>(
        (acc, code) => acc ?? res.results?.[code] ?? null,
        null,
      );
      setLink(countryData?.link ?? null);
    });
    return () => {
      cancelled = true;
    };
  }, [id, fetchProviders]);

  if (!data?.results) return null;

  const countryData = PREFERRED_COUNTRIES.reduce<CountryProviders | null>(
    (acc, code) => acc ?? data.results?.[code] ?? null,
    null,
  );

  if (!countryData) return null;

  const hasFlatrate = (countryData.flatrate?.length ?? 0) > 0;
  const hasRent = (countryData.rent?.length ?? 0) > 0;
  const hasBuy = (countryData.buy?.length ?? 0) > 0;
  const hasAds = (countryData.ads?.length ?? 0) > 0;

  if (!hasFlatrate && !hasRent && !hasBuy && !hasAds) return null;

  return (
    <div className="watch-providers-section">
      <h3 className="watch-providers-title">
        <Play size={20} />
        Onde assistir
      </h3>
      <div className="watch-providers-content">
        {hasFlatrate && (
          <ProviderLogos
            providers={countryData.flatrate!}
            label="Streaming"
          />
        )}
        {hasAds && (
          <ProviderLogos providers={countryData.ads!} label="Com anúncios" />
        )}
        {hasRent && (
          <ProviderLogos providers={countryData.rent!} label="Alugar" />
        )}
        {hasBuy && (
          <ProviderLogos providers={countryData.buy!} label="Comprar" />
        )}
      </div>
      {link && (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="watch-providers-link"
        >
          Ver todos os provedores no TMDB
        </a>
      )}
      <p className="watch-providers-attribution">
        Dados de disponibilidade por{" "}
        <a
          href="https://www.justwatch.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          JustWatch
        </a>
      </p>
    </div>
  );
}
