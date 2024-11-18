import { createClient } from '@sanity/client';

const { NODE_ENV } = process.env;

export enum Datasett {
  EF_TEST = 'ef-test',
  EF = 'ef-brev',
  BA = 'ba-brev',
  KS = 'ks-brev',
}

export const client = (dataset: Datasett) =>
  createClient({
    projectId: 'xsrv1mh6',
    dataset,
    useCdn: NODE_ENV == 'production' || NODE_ENV == 'preprod',
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
