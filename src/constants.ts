import { PublicKey } from "@solana/web3.js";

export const DENOMINATOR = 1_000_000;
export const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);

export const metadataSeed = Buffer.from("metadata");
export const editionSeed = Buffer.from("edition");
export const globalSeed = Buffer.from("global");
export const bondingCurveSeed = Buffer.from("bonding-curve");
