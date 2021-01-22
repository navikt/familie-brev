export interface IMiljøvariabler {
  FAMILIE_DOKUMENT_API_URL: string;
}

export const hentMiljøvariabler = () => {
  switch (process.env.NODE_ENV) {
    case 'production':
      return {
        FAMILIE_DOKUMENT_API_URL: 'http://familie-dokument',
      };
    default:
      return {
        FAMILIE_DOKUMENT_API_URL: 'localhost:8082',
      };
  }
};
