import React, { useState } from 'react';
import { STORES, PLACEHOLDER_LOGO } from './constants';
import { calculateDistance } from './utils/haversine';
import { getCurrentPosition, getLocationFromCep, getAddressFromCoordinates } from './services/locationService';
import { Store, Coordinates } from './types';
import StoreCard from './components/StoreCard';

const App: React.FC = () => {
  const [cep, setCep] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nearestStore, setNearestStore] = useState<Store | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [userAddress, setUserAddress] = useState<string>('');

  const handleCalculateNearest = (userCoords: Coordinates) => {
    let minDistance = Infinity;
    let closest: Store | null = null;

    STORES.forEach((store) => {
      const dist = calculateDistance(
        userCoords.latitude,
        userCoords.longitude,
        store.latitude,
        store.longitude
      );

      if (dist < minDistance) {
        minDistance = dist;
        closest = store;
      }
    });

    setNearestStore(closest);
    setDistance(minDistance);
    setLoading(false);
  };

  const handleCepSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setNearestStore(null);
    setUserAddress('');

    try {
      // Now returns coords AND the formatted address string
      const locationData = await getLocationFromCep(cep);
      setUserAddress(locationData.address);
      handleCalculateNearest({ 
        latitude: locationData.latitude, 
        longitude: locationData.longitude 
      });
    } catch (err: any) {
      setError(err.message || 'Erro ao buscar localização.');
      setLoading(false);
    }
  };

  const handleGeolocation = async () => {
    setLoading(true);
    setError(null);
    setNearestStore(null);
    setUserAddress('');
    
    try {
      const coords = await getCurrentPosition();
      
      // Fetch address description for these coordinates (Reverse Geocoding)
      const addressDesc = await getAddressFromCoordinates(coords.latitude, coords.longitude);
      setUserAddress(addressDesc);

      handleCalculateNearest(coords);
    } catch (err: any) {
      setError(err.message || 'Erro ao obter GPS.');
      setLoading(false);
    }
  };

  // Mask CEP input
  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 8) val = val.slice(0, 8);
    setCep(val);
  };

  return (
    <div className="min-h-screen bg-brand-red flex flex-col items-center px-4 py-8 font-sans">
      
      {/* Header / Logo */}
      <header className="mb-8 flex flex-col items-center">
        <div className="w-32 h-32 bg-white rounded-full p-2 shadow-lg mb-4 overflow-hidden border-4 border-brand-yellow">
           {/* Placeholder for real logo */}
           <img 
            src={PLACEHOLDER_LOGO} 
            alt="Logo Mais Que Coxinha" 
            className="w-full h-full object-cover rounded-full"
           />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white text-center drop-shadow-md">
          MAIS QUE COXINHA
        </h1>
        <p className="text-brand-yellow font-semibold mt-2 text-center text-lg">
          Encontre a unidade mais perto de você!
        </p>
      </header>

      {/* Main Action Area */}
      {!nearestStore ? (
        <main className="w-full max-w-sm flex flex-col gap-6 animate-fade-in">
          
          {/* Option 1: Geolocation */}
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 shadow-xl">
            <h3 className="text-white text-lg font-bold mb-4 text-center">
              📍 Jeito mais rápido
            </h3>
            <button
              onClick={handleGeolocation}
              disabled={loading}
              className="w-full bg-brand-yellow hover:bg-brand-yellowHover text-brand-red font-bold py-3 px-4 rounded-lg shadow-md flex items-center justify-center gap-2 transition-transform transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-brand-red" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
              {loading ? 'Identificando local...' : 'Usar Localização Atual'}
            </button>
          </div>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-white/30"></div>
            <span className="flex-shrink-0 mx-4 text-white font-semibold">OU</span>
            <div className="flex-grow border-t border-white/30"></div>
          </div>

          {/* Option 2: CEP */}
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 shadow-xl">
             <h3 className="text-white text-lg font-bold mb-4 text-center">
              🏠 Buscar por CEP
            </h3>
            <form onSubmit={handleCepSearch} className="flex flex-col gap-3">
              <input
                type="tel" 
                pattern="[0-9]*"
                inputMode="numeric"
                placeholder="Digite seu CEP (apenas números)"
                value={cep}
                onChange={handleCepChange}
                maxLength={8}
                className="w-full px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-brand-yellow font-bold text-center text-lg tracking-widest shadow-inner"
              />
              <button
                type="submit"
                disabled={loading || cep.length !== 8}
                className="w-full bg-white text-brand-red font-bold py-3 px-4 rounded-lg shadow-md hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Pesquisando...' : 'Buscar Unidade'}
              </button>
            </form>
          </div>

          {error && (
            <div className="bg-white/90 border-l-4 border-red-800 text-red-900 p-4 rounded shadow-lg animate-pulse" role="alert">
              <p className="font-bold">Atenção</p>
              <p>{error}</p>
            </div>
          )}

        </main>
      ) : (
        /* Results View */
        <div className="flex flex-col items-center w-full animate-fade-in">
           <StoreCard 
              store={nearestStore} 
              distance={distance || 0} 
              userAddress={userAddress}
           />
           
           <button 
            onClick={() => {
              setNearestStore(null);
              setCep('');
              setUserAddress('');
            }}
            className="mt-8 text-white underline font-semibold hover:text-brand-yellow transition-colors"
           >
             ← Buscar novamente
           </button>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-auto py-6 text-center text-white/60 text-sm">
        <p>&copy; {new Date().getFullYear()} Mais Que Coxinha.</p>
      </footer>
    </div>
  );
};

export default App;