export interface TrainingSlot {
  day: string;
  time: string;
  locationId: string;
}
 
export interface Location {
  name: string;
  address: string;
  lat: number;  // ⚠️ Overte súradnice na Google Maps
  lng: number;
}
 
export const locations: Record<string, Location> = {
  jedlikova: {
    name: 'Jedlíkova 7',
    address: 'Jedlíkova 7, Košice',
    lat: 48.69814880000001,   // ⚠️ Overte
    lng: 21.23390379325404,   // ⚠️ Overte
  },
  ostrovského: {
    name: 'SOŠ Ostrovského',
    address: 'Ostrovského, Košice',
    lat: 48.70384291872286,    // ⚠️ Overte
    lng: 21.250515615589894,  // ⚠️ Overte
  },
};
 
export const dorastTrainings: TrainingSlot[] = [
  { day: 'Utorok',   time: '17:00', locationId: 'ostrovského' },
  { day: 'Streda',   time: '17:00', locationId: 'ostrovského' },
  { day: 'Štvrtok', time: '15:00', locationId: 'jedlikova' },
];