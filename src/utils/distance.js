// Utilities to calculate distances and ETA

const toRad = (deg) => (deg * Math.PI) / 180;

function haversineDistanceKm(lat1, lon1, lat2, lon2) {
  if ([lat1, lon1, lat2, lon2].some((v) => v === null || v === undefined)) return null;
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function estimateTimeMinutes(distanceKm, serviceName) {
  // speeds in km/h by service name (defaults)
  const speeds = {
    'Ambulancia Básica': 40,
    'Ambulancia Avanzada': 60,
    'Traslado Interhospitalario': 70,
    'Atención Domiciliaria': 40,
    'Unidad de Trauma': 50,
    'Pediatría Móvil': 45
  };
  const speed = (serviceName && speeds[serviceName]) ? speeds[serviceName] : 45; // default 45 km/h
  if (distanceKm === null) return null;
  const hours = distanceKm / speed;
  return Math.max(1, Math.round(hours * 60)); // at least 1 minute
}

module.exports = { haversineDistanceKm, estimateTimeMinutes };