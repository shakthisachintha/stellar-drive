import { AWS_CONFIG } from "../configs";

export const jwks = {
  alg: "RS256",
  e: "AQAB",
  kid: AWS_CONFIG.JWKS.Kid,
  kty: "RSA",
  n: AWS_CONFIG.JWKS.N,
  use: "sig",
};
