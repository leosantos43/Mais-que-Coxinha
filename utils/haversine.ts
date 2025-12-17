/**
 * Calcula a distância em quilômetros entre dois pontos geográficos (latitude/longitude)
 * utilizando a Fórmula de Haversine.
 * 
 * A fórmula de Haversine é importante para navegação, fornecendo distâncias de círculo máximo
 * entre dois pontos em uma esfera a partir de suas longitudes e latitudes.
 */
export const calculateDistance = (
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number => {
  const R = 6371; // Raio da Terra em quilômetros
  
  // Converte graus para radianos
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  
  // Fórmula de Haversine
  // a = sin²(Δlat/2) + cos(lat1) * cos(lat2) * sin²(Δlon/2)
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
  // c = 2 * atan2(√a, √(1−a))
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  // Distância = Raio da Terra * c
  const distance = R * c; 
  
  return distance; // Retorna em KM
};

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}