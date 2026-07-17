import { PharmacyJsonInput } from '../interfaces/pharmacie_interface';

const MAX_BATCH_SIZE = 1000;

export type ValidationResult =
    | { valid: true }
    | { valid: false; error: string };

//validation de plusieurs insert
export const validatePharmacyBatch = (data: unknown): ValidationResult => {
    if (!Array.isArray(data) || data.length === 0) {
        return { valid: false, error: 'Expected a non-empty array of pharmacies' }
    }

    if (data.length > MAX_BATCH_SIZE)
        return { valid: false, error: `Batch too large: max ${MAX_BATCH_SIZE} pharmacies per request` }

    // Validation légère par échantillon 
    for (let i = 0; i < data.length; i++) {

        if (typeof data[i] !== 'object' || data[i] === null) {
            return { valid: false, error: `Entry at index ${i} is not a valid object` };
        }
        const pharma = data[i] as PharmacyJsonInput;
        if (!pharma.name || typeof pharma.name !== 'string')
            return { valid: false, error: `Pharmacy at index ${i} is missing a valid 'name'` };

        if (!pharma.ville || typeof pharma.ville !== 'string' || pharma.ville.trim() == '')
            return { valid: false, error: 'Le champ "ville" est requis et doit être une chaîne non vide' };
    }



    return { valid: true };
}


// --- Nouveau : validation d'une seule pharmacie ---

export const validatePharmacyInput = (data: unknown): ValidationResult => {
    if (typeof data !== 'object' || data === null)
        return { valid: false, error: 'Pharmacy Body invalide : objet attendu' }

    const pharma = data as PharmacyJsonInput;

    if (!pharma.name || typeof pharma.name !== 'string' || pharma.name.trim() === '')
        return { valid: false, error: 'Le champ "name" est requis et doit être une chaîne non vide' };

    if (!pharma.ville || typeof pharma.ville !== 'string' || pharma.ville.trim() == '')
        return { valid: false, error: 'Le champ "ville" est requis et doit être une chaîne non vide' };

    return { valid: true };
}


// Validator partiel — tous les champs sont optionnels
export const validatePharmacyUpdate = (data: unknown): ValidationResult => {
    if (typeof data !== 'object' || data === null)
        return { valid: false, error: 'Body invalide : objet attendu' };

    const p = data as Partial<PharmacyJsonInput>;

    // Au moins un champ doit être présent
    const hasAnyField = p.name || p.ville || p.phone || p.address ||
        p.lat !== undefined || p.lng !== undefined ||
        p.group !== undefined;

    if (!hasAnyField)
        return { valid: false, error: 'Au moins un champ à modifier est requis' };

    // Si un champ est présent, on valide son type
    if (p.name !== undefined && (typeof p.name !== 'string' || p.name.trim() === ''))
        return { valid: false, error: '"name" doit être une chaîne non vide' };

    if (p.ville !== undefined && (typeof p.ville !== 'string' || p.ville.trim() === ''))
        return { valid: false, error: '"ville" doit être une chaîne non vide' };

    return { valid: true };
};
