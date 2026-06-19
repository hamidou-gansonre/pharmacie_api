export interface PharmacieProximite {
  id: number;
  nom: string;
  telephone: string;
  secteur: string | null;
  description: string | null;
  latitude: number;
  longitude: number;
  distanceKm: number;
}