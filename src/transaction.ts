import {
  Connection,
  PublicKey,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";

export async function createTransaction(
  connection: Connection,
  payer: PublicKey,
  instructions: TransactionInstruction[]
): Promise<VersionedTransaction> {
  const recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

  const txMessage = new TransactionMessage({
    instructions,
    payerKey: payer,
    recentBlockhash: recentBlockhash,
  }).compileToV0Message();

  const versionedTx = new VersionedTransaction(txMessage);

  return versionedTx;
}

export async function sendTransaction(
  connection: Connection,
  tx: VersionedTransaction
): Promise<string> {
  const signature = await connection.sendRawTransaction(tx.serialize());

  await connection.confirmTransaction({
    signature,
    ...(await connection.getLatestBlockhash()),
  });

  return signature;
}
