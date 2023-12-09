module.exports = {
  // VC type: KYCAgeCredential
  // https://raw.githubusercontent.com/iden3/claim-schema-vocab/main/schemas/json-ld/kyc-v3.json-ld
  KYCAgeCredential: (credentialSubject) => ({
    "circuitId": "credentialAtomicQuerySigV2",
    "id": 1702088228,
    "query": {
      "allowedIssuers": [
        "*"
      ],
      "context": "ipfs://Qma2AwVxBqH1mzNqX349A5HniAT1EHYgESWbtRcZn15MDc",
      "credentialSubject": {
        "pid": {}
      },
      "type": "votingschema"
    }
}),
  // See more off-chain examples
  // https://0xpolygonid.github.io/tutorials/verifier/verification-library/zk-query-language/#equals-operator-1
};
