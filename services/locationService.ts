import { Coordinates, ViaCepResponse, NominatimResponse } from '../types';

interface LocationResult extends Coordinates {
  address: string;
}

/**
 * Get current user position using Browser Geolocation API
 */
export const getCurrentPosition = (): Promise<Coordinates> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocalização não é suportada pelo seu navegador.'));
      return;
    }

    // Options to force high accuracy (GPS)
    const options = {
      enableHighAccuracy: true, // Forces GPS usage
      timeout: 20000,           // Wait up to 20s for a good signal
      maximumAge: 0             // Do not use cached positions
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        let errorMessage = 'Erro ao obter localização.';
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Usuário negou a solicitação de Geolocalização.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Sinal de GPS indisponível. Tente ir para um local aberto.';
            break;
          case error.TIMEOUT:
            errorMessage = 'O GPS demorou muito para responder.';
            break;
        }
        reject(new Error(errorMessage));
      },
      options
    );
  });
};

/**
 * Helper to fetch coordinates from Nominatim
 */
const fetchNominatim = async (query: string): Promise<NominatimResponse | null> => {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`);
    const data: NominatimResponse[] = await res.json();
    return data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error("Nominatim fetch error:", error);
    return null;
  }
};

/**
 * Reverse Geocoding: Get address string from Latitude/Longitude
 */
export const getAddressFromCoordinates = async (lat: number, lon: number): Promise<string> => {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
    const data = await res.json();
    
    if (data && data.address) {
      const addr = data.address;
      
      // Robust field checking (Nominatim varies field names based on location type)
      const street = addr.road || addr.street || addr.pedestrian || addr.footway || addr.path || '';
      const number = addr.house_number ? `, ${addr.house_number}` : '';
      const suburb = addr.suburb || addr.neighbourhood || addr.district || '';
      const city = addr.city || addr.town || addr.municipality || addr.village || '';
      const state = addr.state_district || addr.state || '';

      // Construct a readable string
      // Ex: "Rua das Flores, 123 - Centro, São Paulo"
      let fullAddress = '';
      
      if (street) fullAddress += street + number;
      
      if (suburb) {
        fullAddress += fullAddress ? ` - ${suburb}` : suburb;
      }
      
      if (city) {
        fullAddress += fullAddress ? `, ${city}` : city;
      }

      // If we have very little info, fallback to larger regions
      if (!fullAddress && state) return state;
      if (!fullAddress) return "Localização aproximada (GPS)";

      return fullAddress;
    }
    return "Localização via GPS";
  } catch (error) {
    return "Localização via GPS (Endereço não identificado)";
  }
};

/**
 * Fetch address from ViaCEP and then geocode it using Nominatim.
 */
export const getLocationFromCep = async (cep: string): Promise<LocationResult> => {
  const cleanCep = cep.replace(/\D/g, '');
  
  if (cleanCep.length !== 8) {
    throw new Error('CEP inválido. Deve conter 8 dígitos.');
  }

  // 1. Get Address Data from ViaCEP
  const viaCepRes = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
  const addressData: ViaCepResponse = await viaCepRes.json();

  if (addressData.erro) {
    throw new Error('CEP não encontrado.');
  }

  // Construct formatted address immediately from reliable ViaCEP data
  const formattedAddress = `${addressData.logradouro}, ${addressData.bairro}, ${addressData.localidade} - ${addressData.uf}`;

  let result: NominatimResponse | null = null;

  // 2. Geocoding Strategy Chain
  
  // Strategy A: Full Address including Neighborhood
  const fullAddressQuery = `${addressData.logradouro}, ${addressData.bairro}, ${addressData.localidade} - ${addressData.uf}, Brazil`;
  result = await fetchNominatim(fullAddressQuery);

  // Strategy B: Neighborhood + City
  if (!result && addressData.bairro) {
    const neighborhoodQuery = `${addressData.bairro}, ${addressData.localidade} - ${addressData.uf}, Brazil`;
    result = await fetchNominatim(neighborhoodQuery);
  }

  // Strategy C: CEP
  if (!result) {
    const cepQuery = `${cleanCep}, Brazil`;
    result = await fetchNominatim(cepQuery);
  }

  // Strategy D: City + State
  if (!result) {
    const cityQuery = `${addressData.localidade}, ${addressData.uf}, Brazil`;
    result = await fetchNominatim(cityQuery);
  }

  if (!result) {
    throw new Error('Não foi possível determinar a localização geográfica deste CEP.');
  }

  return {
    latitude: parseFloat(result.lat),
    longitude: parseFloat(result.lon),
    address: formattedAddress
  };
};