const sanityClient = require("@sanity/client");

/**
 * Genererer en sanityclient basert på om vi kjører i miljø eller localhost
 * @return {sanityClient} En sanityclient.
 */
function createSanityClient() {
  let projectID;
  let token;
  let dataset;
  if (process.env.NODE_ENV === "production") {
    projectID = process.env.SANITY_PROJECTID;
    token = process.env.SANITY_TOKEN;
    dataset = process.env.SANITY_DATASET;
  }
  return sanityClient({
    projectId: projectID || "gx9wf39f",
    dataset: dataset || "local-testset",
    token: token || undefined,
    useCdn: token === undefined,
  });
}

module.exports = createSanityClient;
