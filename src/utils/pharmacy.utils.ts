import { PharmacyJsonInput } from "../interfaces/pharmacie_interface";

export const sanitizeText = (value: unknown, maxLength: number): string => {
    const text = String(value ?? '').trim();
    return text.length > maxLength ? text.slice(0, maxLength) : text;
}

export const parseCoordinate = (value: unknown): number => {
    if (value == undefined || value == null) return 0;
    const parsed = typeof value === 'string' ?
        parseFloat(value.replace(/,/g, '.')) : Number(value);

    return Number.isFinite(parsed) ? parsed : 0;
}

export const parseCoordinateOrNull = (value: unknown): number | null => {
    const parsed = typeof value === 'string' ?
        parseFloat(value.replace(/,/g, '.')) : Number(value);

    return Number.isFinite(parsed) ? parsed : null;
}

export const parsedGroup = (value: unknown): number => {
    if (value === undefined || value === null) return 1;
    const parsed = typeof value === 'string' ? parseInt(value, 10) : Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

//  mapper réutilisable dans tous les controllers
export const toPharmacyRecord = (pharmacy: PharmacyJsonInput) => ({
    nom: sanitizeText(pharmacy.name, 150),
    telephone: sanitizeText(pharmacy.phone ?? '', 20),
    description: pharmacy.address?.trim() || null,
    ville: pharmacy.ville.trim(),        // string garanti par l'interface
    latitude: parseCoordinate(pharmacy.lat),
    longitude: parseCoordinate(pharmacy.lng),
    groupeGarde: parsedGroup(pharmacy.group),
});


// Mapper partiel — ne retourne que les champs présents dans le body
export const toPharmacyUpdateRecord = (pharmacy: Partial<PharmacyJsonInput>) => {
    const data: Record<string, unknown> = {};

    if (pharmacy.name !== undefined)
        data.nom = sanitizeText(pharmacy.name, 150);

    if (pharmacy.phone !== undefined)
        data.telephone = sanitizeText(pharmacy.phone, 20);

    if (pharmacy.address !== undefined)
        data.description = pharmacy.address?.trim() || null;

    if (pharmacy.ville !== undefined)
        data.ville = pharmacy.ville.trim();

    if (pharmacy.lat !== undefined)
        data.latitude = parseCoordinate(pharmacy.lat);

    if (pharmacy.lng !== undefined)
        data.longitude = parseCoordinate(pharmacy.lng);

    if (pharmacy.group !== undefined)
        data.groupeGarde = parsedGroup(pharmacy.group);

    return data;
};