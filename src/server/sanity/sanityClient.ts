const sanityClient = require("@sanity/client");

export enum Datasett {
  TEST = "testdata",
  EF = "ef-brev",
  BA = "ba-brev",
}

export const client = (dataset: Datasett) =>
  sanityClient({
    projectId: "xsrv1mh6",
    dataset,
    useCdn: true,
  });
