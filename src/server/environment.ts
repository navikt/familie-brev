import { NODE_ENV, ENV } from './index';

export interface IMiljøvariabler {
  FAMILIE_DOKUMENT_API_URL: string;
}

export const hentMiljøvariabler = () => {
  if (ENV === 'e2e') {
    return {
      FAMILIE_DOKUMENT_API_URL: 'http://localhost:8082',
    };
  }

  switch (NODE_ENV) {
    case 'production':
      return {
        FAMILIE_DOKUMENT_API_URL: 'http://familie-dokument',
      };
    default:
      return {
        FAMILIE_DOKUMENT_API_URL: 'http://localhost:8082',
      };
  }
};
