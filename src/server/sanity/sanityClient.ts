import { createClient } from '@sanity/client';

const { NODE_ENV } = process.env;

export enum Datasett {
  TEST = 'testdata',
  EF = 'ef-brev',
  BA = 'ba-brev',
  BA_TEST = 'ba-test',
  EF_TEST = 'ef-test',
  KS = 'ks-brev',
  KS_TEST = 'ks-test',
}

export const client = (dataset: Datasett) =>
  createClient({
    projectId: 'xsrv1mh6',
    dataset,
    useCdn: NODE_ENV == 'production' || NODE_ENV == 'preprod',
    maxRetries: 3,
  });
