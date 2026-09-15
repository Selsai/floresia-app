export const STORES = [
  {
    id: 'store-1',
    name: 'Florésia Bastille',
    address: '12 rue de la Roquette, 75011 Paris',
    lat: 48.8532,
    lng: 2.3730,
  },
  {
    id: 'store-2',
    name: 'Florésia Montmartre',
    address: '8 rue des Abbesses, 75018 Paris',
    lat: 48.8842,
    lng: 2.3389,
  },
  {
    id: 'store-3',
    name: 'Florésia Saint-Germain',
    address: '25 rue de Seine, 75006 Paris',
    lat: 48.8543,
    lng: 2.3364,
  },
];

// Distance à vol d'oiseau — formule de Haversine
export function distanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371;

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Interroge OpenStreetMap — API Overpass gratuite et sans clé
export async function fetchNearbyFlorists(
  lat,
  lng,
  radiusMeters = 3000,
  limit = 5
) {
  if (!lat || !lng) {
    throw new Error(
      'Coordonnées manquantes pour la recherche de fleuristes.'
    );
  }

  const OVERPASS_ENDPOINTS = [
    'https://overpass-api.de/api/interpreter',
    'https://overpass.kumi.systems/api/interpreter',
  ];

 const query = `
  [out:json][timeout:15];
  node(around:${radiusMeters},${lat},${lng})[shop=florist];
  out body ${limit};
`;

  let lastError = null;

  for (const endpoint of OVERPASS_ENDPOINTS) {
    try {
      const url = `${endpoint}?data=${encodeURIComponent(query)}`;
      const res = await fetch(url);

      if (!res.ok) {
        const errorText = await res.text();

        console.error(
          `Overpass ${res.status} sur ${endpoint} :`,
          errorText
        );

        lastError = new Error(
          `Serveur Overpass a répondu ${res.status}`
        );

        continue;
      }

      const data = await res.json();

      return (data.elements || [])
        .map((el) => {
          const street = el.tags?.['addr:street'];
          const number = el.tags?.['addr:housenumber'];

          return {
            id: `osm-${el.id}`,
            name:
              el.tags?.name ||
              'Fleuriste (nom non renseigné sur OSM)',

            address: street
              ? `${number ? `${number} ` : ''}${street}`
              : '',

            lat: el.lat,
            lng: el.lon,
            distance: distanceKm(
              lat,
              lng,
              el.lat,
              el.lon
            ),
          };
        })
        .sort((a, b) => a.distance - b.distance)
        .slice(0, limit);
    } catch (err) {
      console.error(`Échec sur ${endpoint} :`, err);
      lastError = err;
    }
  }

  throw (
    lastError ||
    new Error('Aucun serveur Overpass disponible.')
  );
}

export function nearestStores(lat, lng, limit = 3) {
  return [...STORES]
    .map((store) => ({
      ...store,
      distance: distanceKm(
        lat,
        lng,
        store.lat,
        store.lng
      ),
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, limit);
}