import { Store } from './types';

export const STORES: Store[] = [
  {
    id: 1,
    name: 'Mais Que Coxinha – Ermelino',
    latitude: -23.49506504227554,
    longitude: -46.46900406997714,
    orderLink: 'https://maisquecoxinha.pedir.site/mobile'
  },
  {
    id: 2,
    name: 'Mais Que Coxinha – Parque das Nações',
    latitude: -23.439799879532348,
    longitude: -46.41190519963625,
    orderLink: 'https://maisquecoxinhapimentas.pedir.site/mobile'
  }
];

/**
 * COMO USAR SUA PRÓPRIA IMAGEM (Arquivo Local):
 * 1. Coloque seu arquivo de imagem (ex: logo.png) na mesma pasta deste arquivo ou na pasta pública.
 * 2. Mude a constante abaixo para o caminho do arquivo.
 *    Exemplo: export const PLACEHOLDER_LOGO = "./logo.png";
 * 
 * Por enquanto, estamos usando um logo "Embutido" (Base64) para funcionar sem arquivos externos.
 */

// Logo apontando para o arquivo local na raiz
export const PLACEHOLDER_LOGO = "./coxinha.png";