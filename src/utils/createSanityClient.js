const { createClient } = require("@sanity/client");

/**
 * Genererer en sanityclient
 * @return {sanityClient} En sanityclient.
 */
function createSanityClient() {
  let projectId = process.env.SANITY_PROJECTID || "gx9wf39f";
  let dataset = process.env.SANITY_DATASET || "soknadsveiviser-p";
  let token = process.env.SANITY_TOKEN;
  if (!token && process.env.NODE_ENV !== "test") {
    console.error('Sanity token is required')
    process.exit(1)
  }
  return createClient({
    projectId,
    dataset,
    token,
    useCdn: token === undefined,
    apiVersion: "v1", // FIXME: burde oppdateres til å bruke dato (https://www.sanity.io/help/js-client-api-version)
  });
}

module.exports = createSanityClient;
