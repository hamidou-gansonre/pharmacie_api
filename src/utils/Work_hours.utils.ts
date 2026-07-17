import { getActiveGardeGroup } from "./group_garde.utils";


export interface PharmacyTimeStatus {
    isNormalHours: boolean;
    isGardeHours: boolean;
    activeGroup: number;
}

export function getPharmacyTimeStatus(date: Date, city: string): PharmacyTimeStatus {

    const day = date.getUTCDay();     // 0 = Dimanche, 1 = Lundi, ..., 6 = Samedi
    const hour = date.getUTCHours();  // 0 à 23 (Heure GMT locale au Burkina)


    // 1. Définition des heures normales : Lundi(1) au Vendredi(5) de 08h00 à 16h59
    const isWeekday = day >= 1 && day <= 5;
    const isNormalHour = hour >= 8 && hour < 18;
    const isNormalHours = isWeekday && isNormalHour;

    // 2. Si on n'est pas en heures normales, on est d'office en heures de garde
    const isGardeHours = !isNormalHours;
    // 3. Récupérer le groupe de garde actif pour ce moment précis via notre fonction mathématique
    const activeGroup = getActiveGardeGroup(city, date);

    return {
        isNormalHours,
        isGardeHours,
        activeGroup
    }
}