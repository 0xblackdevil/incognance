const { KYCAgeCredential } = require("./vcHelpers/KYCAgeCredential");

const humanReadableAuthReason = "Must vote coz its your right";

const credentialSubject = {};

const proofRequest = KYCAgeCredential(credentialSubject);

module.exports = {
  humanReadableAuthReason,
  proofRequest,
};
