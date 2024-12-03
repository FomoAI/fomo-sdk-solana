import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import { PublicKey } from "@solana/web3.js";
export function sortPubkeys(pubkeys: string[]): string[] {
  return pubkeys.sort((a, b) => {
    const aBytes = bs58.decode(a);
    const bBytes = bs58.decode(b);

    for (let i = 0; i < aBytes.length; i++) {
      if (aBytes[i] < bBytes[i]) return -1;
      if (aBytes[i] > bBytes[i]) return 1;
    }
    return 0;
  });
}

export function getCpmmPoolPda(
  programId: PublicKey,
  tokenA: PublicKey,
  tokenB: PublicKey,
  ammConfig: PublicKey
) {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from("pool"),
      ammConfig.toBuffer(),
      tokenA.toBuffer(),
      tokenB.toBuffer(),
    ],
    programId
  )[0];
}

export function getAmmPda(index: number, programId: PublicKey) {
  const indexBuffer = Buffer.alloc(2);

  indexBuffer.writeUint16BE(index);

  return PublicKey.findProgramAddressSync(
    [Buffer.from("amm_config"), indexBuffer],
    programId
  )[0];
}
