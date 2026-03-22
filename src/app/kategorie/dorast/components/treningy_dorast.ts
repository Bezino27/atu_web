// Typ pre dni v týždni – obmedzíš chyby (nemôžeš napísať hocijaký string)
export type WeekDay =
  | "Pondelok"
  | "Utorok"
  | "Streda"
  | "Štvrtok"
  | "Piatok"
  | "Sobota"
  | "Nedeľa";

// ID haly – prepojenie medzi tréningom a miestom
export type LocationId = "ostrovskeho" | "jedlikova" | "siposa";

// Interface pre tréningový slot
export interface TrainingSlot {
  day: WeekDay;
  time: {
    from: string; // napr. "16:00"
    to: string;   // napr. "17:30"
  };
  category: string;
  locationId: LocationId;
}

// Interface pre halu
export interface Location {
  id: LocationId;
  name: string;
  address: string;
  gps: {
    lat: number;
    lng: number;
  };
}

// Zoznam hál
export const locations: Record<LocationId, Location> = {
  ostrovskeho: {
    id: "ostrovskeho",
    name: "Ostrovského",
    address: "Ostrovského 1, Košice, Slovensko",
    gps: {
      lat: 48.7164,
      lng: 21.2611,
    },
  },
  jedlikova: {
    id: "jedlikova",
    name: "Jedlíkova",
    address: "Jedlíkova 7, Košice, Slovensko",
    gps: {
      lat: 48.7098,
      lng: 21.2575,
    },
  },
  siposa: {
    id: "siposa",
    name: "Hádzanárska hala Slavomíra Šiposa",
    address: "Viedenská cesta, Košice, Slovensko",
    gps: {
      lat: 48.7032,
      lng: 21.2458,
    },
  },
};

// Testovacie tréningy pre "Dorast"
export const dorastTrainings: TrainingSlot[] = [
  {
    day: "Pondelok",
    time: { from: "16:00", to: "17:30" },
    category: "Dorast",
    locationId: "ostrovskeho",
  },
  {
    day: "Utorok",
    time: { from: "17:00", to: "18:30" },
    category: "Dorast",
    locationId: "jedlikova",
  },
  {
    day: "Streda",
    time: { from: "16:30", to: "18:00" },
    category: "Dorast",
    locationId: "siposa",
  },
  {
    day: "Štvrtok",
    time: { from: "17:00", to: "18:30" },
    category: "Dorast",
    locationId: "ostrovskeho",
  },
  {
    day: "Piatok",
    time: { from: "16:00", to: "17:30" },
    category: "Dorast",
    locationId: "jedlikova",
  },
  {
    day: "Sobota",
    time: { from: "10:00", to: "11:30" },
    category: "Dorast",
    locationId: "siposa",
  },
  {
    day: "Nedeľa",
    time: { from: "10:00", to: "11:30" },
    category: "Dorast",
    locationId: "ostrovskeho",
  },
];