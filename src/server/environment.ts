import { Datasett } from './sanity/sanityClient';

const { NODE_ENV } = process.env;

export interface IMiljøvariabler {
  FAMILIE_DOKUMENT_API_URL: string;
  BA_DATASETT: Datasett;
  EF_DATASETT: Datasett;
  KS_DATASETT: Datasett;
}

export const hentMiljøvariabler = (): IMiljøvariabler => {
  switch (NODE_ENV) {
    case 'production':
      return {
        FAMILIE_DOKUMENT_API_URL: 'http://familie-dokument',
        BA_DATASETT: Datasett.BA,
        EF_DATASETT: Datasett.EF,
        KS_DATASETT: Datasett.KS,
      };
    default:
      return {
        FAMILIE_DOKUMENT_API_URL: 'http://localhost:8082',
        BA_DATASETT: Datasett.BA_V2,
        EF_DATASETT: Datasett.EF_TEST,
        KS_DATASETT: Datasett.KS_V2,
      };
  }
};
