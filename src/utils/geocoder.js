const fs = require('fs');
//const axios = require('axios');
import axios from 'axios';

// 1. Charger le fichier des pharmacies manquantes
const pharmacies = require('./pharmacie.json');

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function geocodeAll() {
  const results = [];
  console.log(`Début du géocodage pour ${pharmacies.length} pharmacies...`);

  for (let i = 0; i < pharmacies.length; i++) {
    const phar = pharmacies[i];
    // Création de la même requête d'adresse précise
    const searchQuery = `${phar.name}, ${phar.adresse}, Ouagadougou, Burkina Faso`;
    
    try {
      console.log(`[${i + 1}/${pharmacies.length}] Recherche : ${phar.name}...`);
      
      const response = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: {
          q: searchQuery,
          format: 'json',
          limit: 1
        },
        headers: {
          // OpenStreetMap demande un User-Agent pour identifier ton script
          'User-Agent': 'PharmacyAppBurkina/1.0' 
        }
      });

      if (response.data && response.data.length > 0) {
        phar.lat = parseFloat(response.data[0].lat);
        phar.lng = parseFloat(response.data[0].lon);
        console.log(`✅ Trouvé : ${phar.lat}, ${phar.lng}`);
      } else {
        // Si OSM ne trouve pas avec le nom exact, on fait une tentative de repli uniquement sur le quartier
        console.log(`⚠️ Précision requise pour ${phar.name}, nouvel essai avec le quartier...`);
        const fallbackQuery = `${phar.adresse}, Ouagadougou, Burkina Faso`;
        
        const fallbackResponse = await axios.get('https://nominatim.openstreetmap.org/search', {
          params: { q: fallbackQuery, format: 'json', limit: 1 },
          headers: { 'User-Agent': 'PharmacyAppBurkina/1.0' }
        });

        if (fallbackResponse.data && fallbackResponse.data.length > 0) {
          phar.lat = parseFloat(fallbackResponse.data[0].lat);
          phar.lng = parseFloat(fallbackResponse.data[0].lon);
          console.log(`👉 Positionné par défaut dans le quartier : ${phar.lat}, ${phar.lng}`);
        } else {
          phar.lat = null;
          phar.lng = null;
          console.log(`❌ Introuvable`);
        }
      }
    } catch (error) {
      console.error(`Erreur sur ${phar.name}:`, error.message);
      phar.lat = null;
      phar.lng = null;
    }

    results.push(phar);
    // Respecter la politique d'OSM (1 requête max par seconde)
    await delay(1200); 
  }

  // 3. Sauvegarder le résultat final dans un nouveau fichier JSON propre
  fs.writeFileSync('./manquantes_geocodees.json', JSON.stringify(results, null, 2));
  console.log('🏁 Terminé ! Le fichier manquantes_geocodees.json est prêt.');
}

geocodeAll();