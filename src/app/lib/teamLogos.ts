const DEFAULT_TEAM_LOGO = "/logo/teams/default.svg";

const TEAM_ALIASES: Record<string, string> = {
  "fabk atu kosice": "atu-kosice",
  "atu kosice": "atu-kosice",

  "1. fbc trencin": "fbc-trencin",
  "fbc trencin": "fbc-trencin",
  "1.fbc trencin": "fbc-trencin",

  "sk lido prirodovedec bratislava": "sk-lido-bratislava",
  "sk lido bratislava": "sk-lido-bratislava",

  "tsunami zahorska bystrica": "tsunami-zahorska-bystrica",

  "fbc grasshoppers ac uniza zilina": "grasshoppers-zilina",
  "grasshoppers zilina": "grasshoppers-zilina",

  "fk florko kosice": "florko-kosice",
  "fk florko": "florko-kosice",

  "snipers bratislava": "snipers-bratislava",

  "fbk nizna": "fbk-nizna",

  "florbalovy klub as trencin": "as-trencin",
  "as trencin": "as-trencin",
  "asko": "as-trencin",

  "vsk ftvs uk hurikan bratislava": "hurikan-bratislava",
  "hurikan bratislava": "hurikan-bratislava",

  "dtf team detva joxers": "detva-joxers",

  "tempish capitol floorball club": "tempish-capitol",
  "capitol": "tempish-capitol",
};

const TEAM_LOGOS: Record<string, string> = {
  "atu-kosice": "/logo/teams/atu-kosice.png",
  "fbc-trencin": "/logo/teams/fbc-trencin.png",
  "sk-lido-bratislava": "/logo/teams/sk-lido-bratislava.png",
  "tsunami-zahorska-bystrica": "/logo/teams/tsunami-zahorska-bystrica.png",
  "grasshoppers-zilina": "/logo/teams/grasshoppers-zilina.png",
  "florko-kosice": "/logo/teams/florko-kosice.png",
  "snipers-bratislava": "/logo/teams/snipers-bratislava.png",
  "fbk-nizna": "/logo/teams/fbk-nizna.png",
  "as-trencin": "/logo/teams/as-trencin.png",
  "hurikan-bratislava": "/logo/teams/hurikan-bratislava.png",
  "detva-joxers": "/logo/teams/detva-joxers.png",
  "tempish-capitol": "/logo/teams/tempish-capitol.png",
};

function normalizeTeamName(name: string) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}

export function getTeamLogo(teamName?: string | null) {
  if (!teamName) return DEFAULT_TEAM_LOGO;

  const normalized = normalizeTeamName(teamName);
  const teamKey = TEAM_ALIASES[normalized];

  return teamKey ? TEAM_LOGOS[teamKey] : DEFAULT_TEAM_LOGO;
}