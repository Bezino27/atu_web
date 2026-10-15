const ATU_TEAM_LOGO = "/logo/znak_atu_nove.svg";
const RAW_TEAM_ALIASES: Record<string, string> = {
  "fabk atu kosice": "atu-kosice",
  "atu kosice": "atu-kosice",

  "1. fbc trencin": "fbc-trencin",
  "fbc trencin": "fbc-trencin",
  "1.fbc trencin": "fbc-trencin",

  "sk lido prirodovedec bratislava": "sk-lido-bratislava",
  "sk lido prirodovedec ruzinov": "sk-lido-bratislava",
  "sk lido alfa business partnership prirodovedec ruzinov": "sk-lido-bratislava",
  "sk lido bratislava": "sk-lido-bratislava",

  "tsunami zahorska bystrica": "tsunami-zahorska-bystrica",

  "fbc grasshoppers ac uniza zilina": "grasshoppers-zilina",
  "grasshoppers zilina": "grasshoppers-zilina",

  "fbc mikulas academy presov": "presov",
  "mikulas academy presov": "presov",
  "fbc presov": "presov",
  "presov": "presov",

  "fk florko kosice": "florko-kosice",
  "fk florko": "florko-kosice",

  "snipers bratislava": "snipers-bratislava",
  "oxdog snipers bratislava": "snipers-bratislava",

  "fbk nizna": "fbk-nizna",

  "florbalovy klub as trencin": "as-trencin",
  "as trencin": "as-trencin",
  "asko": "as-trencin",

  "vsk ftvs uk hurikan bratislava": "hurikan-bratislava",
  "hurikan bratislava": "hurikan-bratislava",

  "dtf team detva joxers": "detva-joxers",

  "fbc predator sabinov": "predator-sabinov",

  "tempish capitol floorball club": "tempish-capitol",
  "capitol": "tempish-capitol",
};

const TEAM_LOGOS: Record<string, string> = {
  "atu-kosice": ATU_TEAM_LOGO,
};

const TEAM_LOGO_GLOWS: Record<string, string> = {
  "atu-kosice": "#cbd5e1",
  "fbc-trencin": "#d71920",
  "sk-lido-bratislava": "#3156a3",
  "tsunami-zahorska-bystrica": "#2563eb",
  "grasshoppers-zilina": "#f97316",
  presov: "#dc2626",
  "florko-kosice": "#16a34a",
  "snipers-bratislava": "#ff4d00",
  "fbk-nizna": "#2563eb",
  "as-trencin": "#dc0000",
  "hurikan-bratislava": "#2563eb",
  "detva-joxers": "#eab308",
  "predator-sabinov": "#166534",
  "tempish-capitol": "#dc2626",
};

const HEX_COLOR_PATTERN = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;

function normalizeTeamName(name: string) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

const TEAM_ALIASES = Object.fromEntries(
  Object.entries(RAW_TEAM_ALIASES).map(([alias, teamKey]) => [
    normalizeTeamName(alias),
    teamKey,
  ]),
);

export function getTeamLogo(teamName?: string | null) {
  if (!teamName) return null;

  const normalized = normalizeTeamName(teamName);
  const teamKey = TEAM_ALIASES[normalized];

  if (!teamKey) return null;

  return TEAM_LOGOS[teamKey] ?? null;
}

export function getTeamLogoGlow(
  teamName?: string | null,
  backendColor?: string | null,
) {
  const validBackendColor =
    typeof backendColor === "string" && HEX_COLOR_PATTERN.test(backendColor.trim())
      ? backendColor.trim()
      : null;

  if (validBackendColor) return validBackendColor;
  if (!teamName) return "#64748b";

  const teamKey = TEAM_ALIASES[normalizeTeamName(teamName)];
  return (teamKey && TEAM_LOGO_GLOWS[teamKey]) || "#64748b";
}
