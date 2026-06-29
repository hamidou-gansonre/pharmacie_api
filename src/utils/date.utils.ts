/**
 * Calcule le groupe de garde actif (1 à 4) selon le calendrier de rotation au Burkina.
 * @param date La date actuelle du serveur
 */
export function getTodayGroup(date: Date): number {
    // TODO: Implémenter ta vraie logique de rotation ici.
    // Exemple temporaire : retourne le groupe 1
    return 1;
}

export function isWorkTime(date: Date): boolean {


    const currentTime = date.getUTCHours();

    // 2. Détermination du groupe de garde du jour
    return currentTime >= 8 && currentTime < 17;
}