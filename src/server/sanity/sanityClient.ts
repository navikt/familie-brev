import sanityClient from '@sanity/client';

const { NODE_ENV } = process.env;
export enum Datasett {
  TEST = 'testdata',
  EF = 'ef-brev',
  BA = 'ba-brev',
  BA_TEST = 'ba-test',
  EF_TEST = 'ef-test',
}

export const client = (dataset: Datasett) =>
  sanityClient({
    projectId: 'xsrv1mh6',
    dataset,
    useCdn: NODE_ENV === 'production',
  });
