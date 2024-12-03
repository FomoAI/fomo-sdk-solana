import { PublicKey } from "@solana/web3.js";
import { bondingCurveSeed, globalSeed } from "./constants";

export function getGlobalPda(programId: PublicKey) {
  return PublicKey.findProgramAddressSync([globalSeed], programId)[0];
}

export function getBondingPda(mint: PublicKey, programId: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [bondingCurveSeed, mint.toBuffer()],
    programId
  )[0];
}
