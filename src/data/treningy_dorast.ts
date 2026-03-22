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
    lat: 48.7399,   // ⚠️ Overte
    lng: 21.2458,   // ⚠️ Overte
  },
  ostrovského: {
    name: 'SOŠ Ostrovského',
    address: 'Ostrovského, Košice',
    lat: 48.7180,   // ⚠️ Overte
    lng: 21.2560,   // ⚠️ Overte
  },
};
 
export const dorastTrainings: TrainingSlot[] = [
  { day: 'Pondelok', time: '16:30', locationId: 'jedlikova' },
  { day: 'Utorok',   time: '18:30', locationId: 'ostrovského' },
  { day: 'Streda',   time: '18:30', locationId: 'ostrovského' },
];