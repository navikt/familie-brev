const sanityClient = require("@sanity/client");

export const client = sanityClient({
  projectId: "xsrv1mh6",
  dataset: "testdata",
  useCdn: true,
});
