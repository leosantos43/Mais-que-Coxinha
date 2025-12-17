export interface Store {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  orderLink: string;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string; // City
  uf: string; // State
  erro?: boolean;
}

export interface NominatimResponse {
  lat: string;
  lon: string;
}