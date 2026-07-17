interface CityConfig {
    anchorDate: Date;
    anchorGroup: number;
}

export const CONFIG_GARDES: Record<string, CityConfig> = {
    OUAGADOUGOU: {
        anchorDate: new Date("2026-07-04T08:00:00Z"), // Samedi 4 Juillet 2026 à 08h00 UTC
        anchorGroup: 3, // Groupe de garde actif à cette date
    },
    BOBO_DIOULASSO: {
        anchorDate: new Date("2026-07-04T08:00:00Z"),
        anchorGroup: 2, // Exemple : À ajuster avec le vrai groupe de Bobo à cette date
    },
};


/**
 * Calcule le numéro de groupe de garde actif (1 à 4) pour une ville et une date données.
 */

export function getActiveGardeGroup(city: string, targetedDate: Date): number {
    const config = CONFIG_GARDES[city.toUpperCase()];

    // Si la ville n'est pas configurée ou n'a pas de système à 4 groupes cycliques, 
    // on retourne 0 (ou une valeur par défaut pour désactiver le filtre)
    if (!config) return 0;

    // Sécurité : On s'assure de travailler sur les timestamps UTC absolus
    const targetTimestamp = targetedDate.getTime();
    const anchorTimestamp = config.anchorDate.getTime();

    const msInAWeek = 1000 * 60 * 60 * 24 * 7; //millisecons en semaine
    // Calcul du nombre de semaines écoulées (positif ou négatif)
    const weeksElapsed = (targetedDate.getTime() - config.anchorDate.getTime()) / msInAWeek;
    const exactWeeks = Math.floor(weeksElapsed);

    // Application du Modulo 4 (en base 0)
    let groupIndex = ((config.anchorGroup - 1) + exactWeeks) % 4;
    //// Gestion des modulos négatifs pour les recherches dans le passé
    if (groupIndex < 0) {
        groupIndex += 4;
    }

    // Retour en base 1 (1, 2, 3 ou 4)
    return groupIndex + 1;
}