import { NODE_ENV } from './index';

export interface IMiljøvariabler {
  FAMILIE_DOKUMENT_API_URL: string;
}

export const hentMiljøvariabler = () => {
  switch (NODE_ENV) {
    case 'production':
      return {
        FAMILIE_DOKUMENT_API_URL: 'https://familie-dokument.dev.intern.nav.no',
      };
    default:
      return {
        FAMILIE_DOKUMENT_API_URL: 'http://localhost:8082',
      };
  }
};
