import fs from 'fs';
import axios from 'axios';
import pharmaciesData from './pharmacie_bobo.json';

type PharmacyIn = {
    name: string;
    phone?: string;
    group?: number;
    address?: string | null;
};

type PharmacyOut = PharmacyIn & {
    lat: number | null;
    lng: number | null;
};

const pharmacies: PharmacyIn[] = pharmaciesData as PharmacyIn[];

// Remplacer par votre vraie clé API Google Cloud
const GOOGLE_API_KEY = 'AIzaSyDl6aoDrMeJR04qoou0ZTV9kddxQr7FXOA';

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

async function geocodeAll(): Promise<void> {
    const results: PharmacyOut[] = [];
    console.log(`Début du géocodage Google Maps pour ${pharmacies.length} pharmacies...`);

    for (let i = 0; i < pharmacies.length; i++) {
        const phar = { ...pharmacies[i] } as PharmacyOut;
        const addressPart = phar.address ?? '';

        // On construit une requête claire pour Google : "Nom de la pharmacie, Ouagadougou, Burkina Faso"
        const searchQuery = `${phar.name}, ${addressPart}, Ouagadougou, Burkina Faso`;

        try {
            console.log(`[${i + 1}/${pharmacies.length}] Recherche Google : ${phar.name}...`);

            // Utilisation de l'API Google Places Text Search (très performante pour les noms de commerces)
            const response = await axios.get('https://maps.googleapis.com/maps/api/place/textsearch/json', {
                params: {
                    query: searchQuery,
                    key: GOOGLE_API_KEY
                }
            });

            const data = response.data;

            if (data.status === 'OK' && data.results.length > 0) {
                const location = data.results[0].geometry.location;
                phar.lat = location.lat;
                phar.lng = location.lng;
                console.log(`✅ Trouvé par Google : ${phar.lat}, ${phar.lng}`);
            } else if (data.status === 'ZERO_RESULTS') {
                // Tentative de repli (Fallback) uniquement avec le nom et la ville si l'adresse a perturbé Google
                console.log(`⚠️ Aucun résultat direct, nouvel essai simplifié...`);
                const fallbackQuery = `${phar.name}, Ouagadougou, Burkina Faso`;

                const fallbackResponse = await axios.get('https://maps.googleapis.com/maps/api/place/textsearch/json', {
                    params: { query: fallbackQuery, key: GOOGLE_API_KEY }
                });

                const fallbackData = fallbackResponse.data;
                if (fallbackData.status === 'OK' && fallbackData.results.length > 0) {
                    const fLocation = fallbackData.results[0].geometry.location;
                    phar.lat = fLocation.lat;
                    phar.lng = fLocation.lng;
                    console.log(`👉 Trouvé via requête simplifiée : ${phar.lat}, ${phar.lng}`);
                } else {
                    phar.lat = null;
                    phar.lng = null;
                    console.log(`❌ Introuvable même pour Google`);
                }
            } else {
                console.log(`❌ Erreur API Google status: ${data.status}`);
                phar.lat = null;
                phar.lng = null;
            }
        } catch (error: any) {
            console.error(`Erreur réseau/API sur ${phar.name}:`, error?.message ?? error);
            phar.lat = null;
            phar.lng = null;
        }

        results.push(phar);
        // Google est très rapide, un délai de 100ms suffit largement pour vos tests
        await delay(100);
    }

    fs.writeFileSync('./manquantes_geocodees.json', JSON.stringify(results, null, 2));
    console.log('🏁 Terminé ! Le fichier manquantes_geocodees.json a été mis à jour via Google.');
}

geocodeAll().catch((err) => {
    console.error('Erreur inattendue:', err);
    process.exit(1);
});