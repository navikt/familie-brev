const sanityClient = require("@sanity/client");

const { NODE_ENV } = process.env;

const dataset = "production";

export const client = sanityClient({
  projectId: "xsrv1mh6",
  dataset,
  useCdn: true,
});
