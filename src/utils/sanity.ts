const sanityClient = require("@sanity/client");

const { NODE_ENV } = process.env;

const dataset = NODE_ENV === "production" ? "production" : "testdata";

export const client = sanityClient({
  projectId: "xsrv1mh6",
  dataset,
  useCdn: true,
});
