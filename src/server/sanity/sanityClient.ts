const sanityClient = require("@sanity/client");

const { NODE_ENV } = process.env;
export enum Datasett {
  TEST = "testdata",
  EF = "ef-brev",
  BA = "ba-brev",
}

export const client = (dataset: Datasett) =>
  sanityClient({
    projectId: "xsrv1mh6",
    dataset,
    useCdn: NODE_ENV !== "production",
  });
