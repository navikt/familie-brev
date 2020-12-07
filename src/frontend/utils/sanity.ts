const sanityClient = require("@sanity/client");

export enum Datasett {
  TEST = "testdata",
  EF = "ef-brev",
  BA = "ba-brev",
}

const { NODE_ENV } = process.env;
const useCdn = NODE_ENV !== "production";

export const client = (dataset: Datasett) =>
  sanityClient({
    projectId: "xsrv1mh6",
    dataset,
    useCdn: useCdn,
  });
