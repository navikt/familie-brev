import { createClient } from '@sanity/client';

const { ENV } = process.env;

export enum Datasett {
  TEST = 'testdata',
  EF = 'ef-brev',
  BA = 'ba-brev',
  EF_TEST = 'ef-test',
  KS = 'ks-brev',
}

export const client = (dataset: Datasett) =>
  createClient({
    projectId: 'xsrv1mh6',
    dataset,
    useCdn: ENV == 'production' || ENV == 'preprod',
    maxRetries: 3,
  });

export const clientV2 = (dataset: Datasett, apiVersion: string) =>
  createClient({
    projectId: 'xsrv1mh6',
    dataset,
    useCdn: NODE_ENV == 'production' || NODE_ENV == 'preprod',
    maxRetries: 3,
    apiVersion: apiVersion,
  });
