export type HeroLocation = {
  id: string;
  title: string;
  value: string;
  description: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
};

export const heroInfoCards = [
  {
    id: "founded",
    label: "Rok založenia",
    value: "2000",
    description: "Začiatok florbalovej histórie klubu Akademik TU Košice.",
  },
  {
    id: "league",
    label: "Súťaž",
    value: "Extraliga mužov",
    description: "Dlhodobé pôsobenie v najvyššej slovenskej súťaži.",
  },
  {
    id: "ostrovskeho",
    label: "Domáca hala",
    value: "SOŠ Ostrovského 1",
    description: "Moderné domáce prostredie pre zápasy aj klubové dianie.",
  },
] as const;

export const heroLocations: Record<string, HeroLocation> = {
  ostrovskeho: {
    id: "ostrovskeho",
    title: "Domáca hala",
    value: "SOŠ Ostrovského 1",
    description: "Moderné domáce prostredie pre zápasy aj klubové dianie.",
    name: "SOŠ Ostrovského 1",
    address: "Ostrovského 1, Košice",
    lat: 48.70386010126878,   
    lng: 21.25058525154437,
  },
};