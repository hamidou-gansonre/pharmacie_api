import fs from 'fs';
import axios from 'axios';
import pharmaciesData from './pharmacie.json';

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

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

async function geocodeAll(): Promise<void> {
    const results: PharmacyOut[] = [];
    console.log(`Début du géocodage pour ${pharmacies.length} pharmacies...`);

    for (let i = 0; i < pharmacies.length; i++) {
        const phar = { ...pharmacies[i] } as PharmacyOut;
        const addressPart = phar.address ?? '';
        const searchQuery = `${phar.name}, ${addressPart}, Ouagadougou, Burkina Faso`;

        try {
            console.log(`[${i + 1}/${pharmacies.length}] Recherche : ${phar.name}...`);

            const response = await axios.get('https://nominatim.openstreetmap.org/search', {
                params: {
                    q: searchQuery,
                    format: 'json',
                    limit: 1,
                },
                headers: {
                    'User-Agent': 'PharmacyAppBurkina/1.0',
                },
            });

            const data = response.data;

            if (data && data.length > 0) {
                phar.lat = parseFloat(data[0].lat);
                phar.lng = parseFloat(data[0].lon);
                console.log(`✅ Trouvé : ${phar.lat}, ${phar.lng}`);
            } else {
                console.log(`⚠️ Précision requise pour ${phar.name}, nouvel essai avec le quartier...`);
                const fallbackQuery = `${addressPart}, Ouagadougou, Burkina Faso`;

                const fallbackResponse = await axios.get('https://nominatim.openstreetmap.org/search', {
                    params: { q: fallbackQuery, format: 'json', limit: 1 },
                    headers: { 'User-Agent': 'PharmacyAppBurkina/1.0' },
                });

                const fdata = fallbackResponse.data;
                if (fdata && fdata.length > 0) {
                    phar.lat = parseFloat(fdata[0].lat);
                    phar.lng = parseFloat(fdata[0].lon);
                    console.log(`👉 Positionné par défaut dans le quartier : ${phar.lat}, ${phar.lng}`);
                } else {
                    phar.lat = null;
                    phar.lng = null;
                    console.log(`❌ Introuvable`);
                }
            }
        } catch (error: any) {
            console.error(`Erreur sur ${phar.name}:`, error?.message ?? error);
            phar.lat = null;
            phar.lng = null;
        }

        results.push(phar);
        await delay(1200);
    }

    fs.writeFileSync('./manquantes_geocodees.json', JSON.stringify(results, null, 2));
    console.log('🏁 Terminé ! Le fichier manquantes_geocodees.json est prêt.');
}

geocodeAll().catch((err) => {
    console.error('Erreur inattendue:', err);
    process.exit(1);
});
