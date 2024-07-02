import { createClient } from '@sanity/client';

const { ENV } = process.env;

export enum Datasett {
  TEST = 'testdata',
  EF = 'ef-brev',
  BA = 'ba-brev',
  BA_V2 = 'ba-v2',
  BA_TEST = 'ba-test',
  EF_TEST = 'ef-test',
  KS = 'ks-brev',
  KS_TEST = 'ks-test',
  KS_V2 = 'ks-v2',
}

export const client = (dataset: Datasett) =>
  createClient({
    projectId: 'xsrv1mh6',
    dataset,
    useCdn: ENV == 'production' || ENV == 'preprod',
    maxRetries: 3,
  });
