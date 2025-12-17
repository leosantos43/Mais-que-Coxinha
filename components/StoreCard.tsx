import React from 'react';
import { Store } from '../types';

interface StoreCardProps {
  store: Store;
  distance: number;
  userAddress: string;
}

const StoreCard: React.FC<StoreCardProps> = ({ store, distance, userAddress }) => {
  return (
    <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-auto transform transition-all animate-fade-in-up mt-8 text-center border-4 border-brand-yellow">
      
      {/* User Location Display */}
      <div className="mb-6 border-b border-gray-200 pb-4">
        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">
          Sua localização detectada
        </p>
        <p className="text-gray-800 font-medium text-sm leading-tight px-4">
          📍 {userAddress}
        </p>
      </div>

      <div className="mb-4">
        <span className="inline-block bg-green-100 text-green-800 text-sm font-bold px-3 py-1 rounded-full uppercase tracking-wide">
          Unidade Mais Próxima
        </span>
      </div>
      
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        {store.name}
      </h2>
      
      <div className="flex justify-center items-center mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-red mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span className="text-xl font-semibold text-gray-600">
          ~{distance.toFixed(1)} km
        </span>
      </div>

      <a 
        href={store.orderLink}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full bg-brand-yellow hover:bg-brand-yellowHover text-brand-red font-extrabold text-lg py-4 px-6 rounded-lg shadow-md transition-transform transform hover:scale-105 active:scale-95 uppercase tracking-wider"
      >
        Fazer Pedido Agora
      </a>
      
      <p className="mt-4 text-xs text-gray-400">
        Você será redirecionado para nosso cardápio digital.
      </p>
    </div>
  );
};

export default StoreCard;