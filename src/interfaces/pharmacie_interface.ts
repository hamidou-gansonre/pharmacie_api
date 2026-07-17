export interface PharmacieProximite {
  id: number;
  nom: string;
  telephone: string;
  ville: string;
  description: string | null;
  latitude: number;
  longitude: number;
  distanceKm: number;
}

export interface PharmacyJsonInput {
  name: string;
  ville: string;
  phone?: string | number | null;
  group?: string | number | null;
  address?: string | null;
  lat?: string | number | null;
  lng?: string | number | null;
}