/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState, type CSSProperties } from "react";

import matchesStyles from "../../styles/CategoryMatches.module.css";
import { getTeamLogo } from "@/app/lib/teamLogos";
import type { SzfbMatch, SzfbTeamBrand } from "@/app/lib/szfb";

type NasledujuceZapasyProps = {
  upcomingMatches: SzfbMatch[];
  ownTeamName: string;
  ownTeamBrand: SzfbTeamBrand | null;
  competitionName: string;
  preTitle?: string;
  title?: string;
};

type TeamBrandWithGlow = SzfbTeamBrand & {
  dominant_color?: string | null;
  brand_color?: string | null;
};

type LogoGlowStyle = CSSProperties & {
  "--team-logo-glow": string;
};

const DEFAULT_LOGO_GLOW = "#64748b";
const HEX_COLOR_PATTERN = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;

function formatDate(dateString?: string | null) {
  if (!dateString) return "";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString("sk-SK", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatTime(timeString?: string | null) {
  if (!timeString || timeString.slice(0, 5) === "00:00") {
    return "čas bude doplnený";
  }

  return timeString.slice(0, 5);
}

function getMatchTeams(
  match: SzfbMatch,
  ownTeamName: string,
  ownTeamBrand: SzfbTeamBrand | null,
) {
  const ownDisplayName = ownTeamBrand?.display_name || ownTeamName;
  const opponentDisplayName =
    match.opponent_brand?.display_name || match.opponent;

  if (match.is_home === false) {
    return {
      homeTeam: opponentDisplayName,
      awayTeam: ownDisplayName,
      homeBrand: match.opponent_brand,
      awayBrand: ownTeamBrand,
    };
  }

  return {
    homeTeam: ownDisplayName,
    awayTeam: opponentDisplayName,
    homeBrand: ownTeamBrand,
    awayBrand: match.opponent_brand,
  };
}

function getBackendGlowColor(brand: SzfbTeamBrand | null) {
  if (!brand) return null;

  const brandWithGlow = brand as TeamBrandWithGlow;
  const candidates = [
    brandWithGlow.shadow_color,
    brandWithGlow.dominant_color,
    brandWithGlow.brand_color,
  ];

  return (
    candidates.find(
      (color): color is string =>
        typeof color === "string" && HEX_COLOR_PATTERN.test(color.trim()),
    )?.trim() || null
  );
}

function rgbToHsl(r: number, g: number, b: number) {
  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const lightness = (max + min) / 2;

  if (max === min) {
    return { saturation: 0, lightness };
  }

  const delta = max - min;
  const saturation =
    lightness > 0.5
      ? delta / (2 - max - min)
      : delta / (max + min);

  return { saturation, lightness };
}

function toHex(value: number) {
  return Math.max(0, Math.min(255, Math.round(value)))
    .toString(16)
    .padStart(2, "0");
}

function normalizeGlowColor(r: number, g: number, b: number) {
  const { lightness } = rgbToHsl(r, g, b);

  if (lightness < 0.09) {
    return "#343840";
  }

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function extractDominantColor(logoUrl: string) {
  return new Promise<string | null>((resolve) => {
    const image = new Image();

    image.crossOrigin = "anonymous";
    image.decoding = "async";

    image.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d", { willReadFrequently: true });

        if (!context) {
          resolve(null);
          return;
        }

        const sampleSize = 40;
        canvas.width = sampleSize;
        canvas.height = sampleSize;
        context.clearRect(0, 0, sampleSize, sampleSize);
        context.drawImage(image, 0, 0, sampleSize, sampleSize);

        const pixels = context.getImageData(
          0,
          0,
          sampleSize,
          sampleSize,
        ).data;
        const buckets = new Map<
          string,
          { r: number; g: number; b: number; count: number; score: number }
        >();

        for (let index = 0; index < pixels.length; index += 4) {
          const alpha = pixels[index + 3];

          if (alpha < 90) continue;

          const r = pixels[index];
          const g = pixels[index + 1];
          const b = pixels[index + 2];
          const { saturation, lightness } = rgbToHsl(r, g, b);

          if (lightness > 0.93 && saturation < 0.16) continue;

          const quantize = (value: number) =>
            Math.min(255, Math.round(value / 32) * 32);
          const qr = quantize(r);
          const qg = quantize(g);
          const qb = quantize(b);
          const key = `${qr}-${qg}-${qb}`;
          const colorWeight = 0.35 + saturation * 2.4;
          const existing = buckets.get(key);

          if (existing) {
            existing.r += r;
            existing.g += g;
            existing.b += b;
            existing.count += 1;
            existing.score += colorWeight;
          } else {
            buckets.set(key, {
              r,
              g,
              b,
              count: 1,
              score: colorWeight,
            });
          }
        }

        let winner: {
          r: number;
          g: number;
          b: number;
          count: number;
          score: number;
        } | null = null;

        for (const bucket of buckets.values()) {
          if (!winner || bucket.score > winner.score) {
            winner = bucket;
          }
        }

        if (!winner) {
          resolve(null);
          return;
        }

        resolve(
          normalizeGlowColor(
            winner.r / winner.count,
            winner.g / winner.count,
            winner.b / winner.count,
          ),
        );
      } catch {
        // Remote logo bez CORS povolenia sa nedá bezpečne čítať cez canvas.
        resolve(null);
      }
    };

    image.onerror = () => resolve(null);
    image.src = logoUrl;
  });
}

function TeamLogo({
  teamName,
  brand,
}: {
  teamName: string;
  brand: SzfbTeamBrand | null;
}) {
  const logo = brand?.logo_url || getTeamLogo(teamName);
  const isAtuLogo = logo === "/logo/znak_atu_nove.svg";
  const backendGlowColor = getBackendGlowColor(brand);
  const forceBackendGlow = brand?.use_shadow_color === true;
  const [detectedGlow, setDetectedGlow] = useState<{
    logo: string;
    color: string;
  } | null>(null);
  const fallback = teamName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  useEffect(() => {
    let cancelled = false;

    if (!logo) {
      return () => {
        cancelled = true;
      };
    }

    extractDominantColor(logo).then((color) => {
      if (!cancelled && color) {
        setDetectedGlow({ logo, color });
      }
    });

    return () => {
      cancelled = true;
    };
  }, [logo]);

  const detectedGlowColor =
    detectedGlow?.logo === logo ? detectedGlow.color : null;
  const glowColor = forceBackendGlow
    ? backendGlowColor || DEFAULT_LOGO_GLOW
    : detectedGlowColor || backendGlowColor || DEFAULT_LOGO_GLOW;

  const logoStyle: LogoGlowStyle = {
    "--team-logo-glow": glowColor,
  };

  return (
    <div
      className={`${matchesStyles.featuredMatchTeamLogo} ${
        isAtuLogo ? matchesStyles.featuredMatchTeamLogoAtu : ""
      } ${
        forceBackendGlow && backendGlowColor
          ? matchesStyles.featuredMatchTeamLogoManualGlow
          : ""
      }`}
      style={logoStyle}
    >
      {logo ? (
        <img src={logo} alt="" loading="lazy" />
      ) : (
        <span aria-label={`Logo tímu ${teamName} nie je dostupné`}>
          {fallback || "?"}
        </span>
      )}
    </div>
  );
}

export default function NasledujuceZapasy({
  upcomingMatches,
  ownTeamName,
  ownTeamBrand,
  competitionName,
  preTitle = "Zápasy",
  title = "Featured zápasy",
}: NasledujuceZapasyProps) {
  const nextMatches = upcomingMatches.slice(0, 2);

  return (
    <section className={matchesStyles.featuredMatchesSection}>
      <div className={matchesStyles.featuredMatchesHeading}>
        <span className="preTitle">{preTitle}</span>
        <h2 className="sectionTitle">{title}</h2>
      </div>

      {nextMatches.length === 0 ? (
        <div className={matchesStyles.featuredMatchesEmptyState}>
          <div className={matchesStyles.featuredMatchesEmptyIcon}>📅</div>

          <h3 className={matchesStyles.featuredMatchesEmptyTitle}>
            Momentálne nie sú dostupné žiadne najbližšie zápasy
          </h3>

          <p className={matchesStyles.featuredMatchesEmptyText}>
            Program doplníme hneď po zverejnení ďalších stretnutí.
          </p>
        </div>
      ) : (
        <div className={matchesStyles.featuredMatchesGrid}>
          {nextMatches.map((match, index) => {
            const { homeTeam, awayTeam, homeBrand, awayBrand } =
              getMatchTeams(match, ownTeamName, ownTeamBrand);
            const isNearestMatch = index === 0;

            return (
              <article
                key={match.id}
                className={matchesStyles.featuredMatchCard}
              >
                <div className={matchesStyles.featuredMatchCardTop}>
                  <span
                    className={`${matchesStyles.featuredMatchBadge} ${
                      isNearestMatch
                        ? matchesStyles.featuredMatchBadgePrimary
                        : matchesStyles.featuredMatchBadgeSecondary
                    }`}
                  >
                    {isNearestMatch ? "Najbližší zápas" : "Ďalší zápas"}
                  </span>

                  <span className={matchesStyles.featuredMatchLeague}>
                    {competitionName}
                  </span>
                </div>

                <div className={matchesStyles.featuredMatchTeamsRow}>
                  <div className={matchesStyles.featuredMatchTeamInfo}>
                    <TeamLogo teamName={homeTeam} brand={homeBrand} />

                    <span className={matchesStyles.featuredMatchTeam}>
                      {homeTeam}
                    </span>
                  </div>

                  <div className={matchesStyles.featuredMatchVsDivider}>
                    VS
                  </div>

                  <div className={matchesStyles.featuredMatchTeamInfo}>
                    <TeamLogo teamName={awayTeam} brand={awayBrand} />

                    <span className={matchesStyles.featuredMatchTeam}>
                      {awayTeam}
                    </span>
                  </div>
                </div>

                <div className={matchesStyles.featuredMatchFooter}>
                  <div className={matchesStyles.featuredMatchDateTime}>
                    <strong>{formatDate(match.match_date)}</strong> •{" "}
                    {formatTime(match.match_time)}
                  </div>

                  <div className={matchesStyles.featuredMatchPlace}>
                    {match.venue || "Miesto zatiaľ nie je uvedené"}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
