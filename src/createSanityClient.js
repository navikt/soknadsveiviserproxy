const sanityClient = require("@sanity/client");
const fs = require("file-system");

/**
 * Genererer en sanityclient basert på om vi kjører i miljø eller localhost
 * @return {sanityClient} En sanityclient.
 */
function createSanityClient() {
  let projectID;
  let token;
  let dataset;
  if (process.env.NODE_ENV === "production") {
    [projectID, token, dataset] = getSanitySecrets();
  }
  return sanityClient({
    projectId: projectID || "gx9wf39f",
    dataset: dataset || "local-testset",
    token: token || undefined,
    useCdn: token === undefined
  });
}

module.exports = createSanityClient;

/**
 * Henter miljøvariabler for Sanity fra Vault
 * @return {[string, string, string]} Miljøvariabler for bruk til sanityclient..
 */
function getSanitySecrets() {
  const secretsFilePath = "/var/run/secrets/nais.io/vault";
  const projectIDPath = secretsFilePath + "/sanity.projectID";
  const tokenPath = secretsFilePath + "/sanity.token";
  const datasetPath = secretsFilePath + "/sanity.dataset";

  projectID = fs.readFileSync(projectIDPath, "utf8");
  token = fs.readFileSync(tokenPath, "utf8");
  dataset = fs.readFileSync(datasetPath, "utf8");
  return [projectID, token, dataset];
}
