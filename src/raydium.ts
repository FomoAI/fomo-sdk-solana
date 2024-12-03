import {
  Cluster,
  ComputeBudgetProgram,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  TransactionInstruction,
  VersionedTransaction,
} from "@solana/web3.js";
import {
  ApiV3PoolInfoStandardItemCpmm,
  CREATE_CPMM_POOL_FEE_ACC,
  CREATE_CPMM_POOL_PROGRAM,
  CurveCalculator,
  DEVNET_PROGRAM_ID,
  getCpmmPdaAmmConfigId,
  Raydium,
  TxVersion,
} from "@raydium-io/raydium-sdk-v2";
import IDL from "./idl/ray_idl.json";
import {
  createAssociatedTokenAccountInstruction,
  createBurnCheckedInstruction,
  createSyncNativeInstruction,
  getAssociatedTokenAddressSync,
  NATIVE_MINT,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { Program as LegacyProgam } from "coral-xyz3";
import { AnchorProvider, BN, Program } from "@coral-xyz/anchor";
import { getBondingPda } from "./pda";
import { DENOMINATOR } from "./constants";
import { FomoContract } from "./idl/fomo_contract.devnet";
import { createTransaction, sendTransaction } from "./transaction";
import { getAmmPda, getCpmmPoolPda, sortPubkeys } from "./utils";
import { RaydiumCpSwap } from "./idl/ray_cp_swap";
import { ASSOCIATED_PROGRAM_ID } from "coral-xyz3/dist/cjs/utils/token";

export class FomoRaydium {
  private program: Program<FomoContract>;
  raydium: Raydium;
  private cluster: Cluster;
  private connection: Connection;
  private authority?: Keypair;

  constructor(
    connection: Connection,
    cluster: Cluster,
    program: Program<FomoContract>,
    authority?: Keypair | undefined
  ) {
    this.connection = connection;
    this.authority = authority;
    this.program = program;
    this.cluster = cluster;
  }

  async createPool(token: PublicKey, priorityFee: number) {
    if (!this.authority) throw new Error("Missing authority keypair!");

    this.raydium = await Raydium.load({
      connection: this.connection,
      cluster: this.cluster === "mainnet-beta" ? "mainnet" : "devnet",
      owner: this.authority,
    });

    const config = await this.getConfig();
    const bondingCurve = getBondingPda(token, this.program.programId);

    const bondingBalance = await this.connection.getBalance(bondingCurve);

    const [mintA, mintB] = sortPubkeys([
      token.toString(),
      NATIVE_MINT.toString(),
    ]);

    const ammPool = getAmmPda(config.index, CREATE_CPMM_POOL_PROGRAM);

    const poolPda = getCpmmPoolPda(
      CREATE_CPMM_POOL_PROGRAM,
      new PublicKey(mintA),
      new PublicKey(mintB),
      ammPool
    );

    const withdrawIx = await this.program.methods
      .withdraw()
      .accounts({
        mint: token,
        authority: this.authority.publicKey,
      })
      .instruction();

    const [mintAAmount, mintBAmount] =
      mintA === NATIVE_MINT.toString()
        ? [
            new BN(bondingBalance - 2 * LAMPORTS_PER_SOL),
            new BN(150_000_000 * DENOMINATOR),
          ]
        : [
            new BN(150_000_000 * DENOMINATOR),
            new BN(bondingBalance - 2 * LAMPORTS_PER_SOL),
          ];

    const program = new LegacyProgam<RaydiumCpSwap>(
      IDL as any,
      CREATE_CPMM_POOL_PROGRAM,
      new AnchorProvider(this.connection, {} as any, {})
    );

    const obsState = PublicKey.findProgramAddressSync(
      [Buffer.from("observation"), poolPda.toBuffer()],
      program.programId
    )[0];

    const lpMint = PublicKey.findProgramAddressSync(
      [Buffer.from("pool_lp_mint"), poolPda.toBuffer()],
      program.programId
    )[0];

    const lpAta = getAssociatedTokenAddressSync(
      lpMint,
      this.authority.publicKey,
      true
    );

    const vault0Pda = PublicKey.findProgramAddressSync(
      [
        Buffer.from("pool_vault"),
        poolPda.toBuffer(),
        new PublicKey(mintA).toBuffer(),
      ],
      program.programId
    )[0];

    const vault1Pda = PublicKey.findProgramAddressSync(
      [
        Buffer.from("pool_vault"),
        poolPda.toBuffer(),
        new PublicKey(mintB).toBuffer(),
      ],
      program.programId
    )[0];

    const auth = PublicKey.findProgramAddressSync(
      [Buffer.from("vault_and_lp_mint_auth_seed")],
      program.programId
    )[0];

    const ix = await program.methods
      .initialize(mintAAmount, mintBAmount, new BN(0))
      .accounts({
        ammConfig: ammPool,
        associatedTokenProgram: ASSOCIATED_PROGRAM_ID,
        authority: auth,
        createPoolFee: CREATE_CPMM_POOL_FEE_ACC,
        creator: this.authority.publicKey,
        creatorToken0: getAssociatedTokenAddressSync(
          new PublicKey(mintA),
          this.authority.publicKey
        ),
        creatorToken1: getAssociatedTokenAddressSync(
          new PublicKey(mintB),
          this.authority.publicKey
        ),
        observationState: obsState,
        poolState: poolPda,
        rent: SYSVAR_RENT_PUBKEY,
        systemProgram: SystemProgram.programId,
        lpMint: lpMint,
        creatorLpToken: lpAta,
        token0Mint: mintA,
        token1Mint: mintB,
        token0Program: TOKEN_PROGRAM_ID,
        token1Program: TOKEN_PROGRAM_ID,
        tokenProgram: TOKEN_PROGRAM_ID,
        token0Vault: vault0Pda,
        token1Vault: vault1Pda,
      })
      .instruction();

    const instructions: TransactionInstruction[] = [
      ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: priorityFee * LAMPORTS_PER_SOL,
      }),
      withdrawIx,
    ];

    const wsolAta = getAssociatedTokenAddressSync(
      NATIVE_MINT,
      this.authority.publicKey
    );

    const wsolInfo = await this.connection.getAccountInfo(wsolAta);

    if (!wsolInfo) {
      instructions.push(
        createAssociatedTokenAccountInstruction(
          this.authority.publicKey,
          wsolAta,
          this.authority.publicKey,
          NATIVE_MINT
        )
      );
    }

    instructions.push(
      SystemProgram.transfer({
        fromPubkey: this.authority.publicKey,
        lamports:
          mintA === NATIVE_MINT.toString()
            ? mintAAmount.toNumber()
            : mintBAmount.toNumber(),
        toPubkey: wsolAta,
      })
    );

    instructions.push(createSyncNativeInstruction(wsolAta));

    instructions.push(ix);

    const tx = await createTransaction(
      this.connection,
      this.authority.publicKey,
      instructions
    );
    tx.sign([this.authority]);

    const sig = await sendTransaction(this.connection, tx);

    return { sig, poolAddress: poolPda, lpMint };
  }

  async burnLp(mint: PublicKey) {
    const ata = getAssociatedTokenAddressSync(mint, this.authority?.publicKey!);

    const balance = await this.connection.getTokenAccountBalance(ata);

    const burn = createBurnCheckedInstruction(
      ata,
      mint,
      this.authority?.publicKey!,
      +balance.value.amount,
      9
    );

    const tx = await createTransaction(
      this.connection,
      this.authority?.publicKey!,
      [
        ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 5_000_000 }),
        burn,
      ]
    );

    tx.sign([this.authority!]);

    const sig = await sendTransaction(this.connection, tx);

    return sig;
  }

  private async getConfig() {
    const feeConfigs = await this.raydium.api.getCpmmConfigs();

    if (this.raydium.cluster === "devnet") {
      feeConfigs.forEach((config) => {
        config.id = getCpmmPdaAmmConfigId(
          DEVNET_PROGRAM_ID.CREATE_CPMM_POOL_PROGRAM,
          config.index
        ).publicKey.toBase58();
      });
    }
    return feeConfigs[0];
  }

  async trade(
    wallet: PublicKey,
    priorityFee: number,
    amount: number,
    from: PublicKey,
    to: PublicKey,
    slippage: number
  ) {
    this.raydium = await Raydium.load({
      connection: this.connection,
      cluster: this.cluster === "mainnet-beta" ? "mainnet" : "devnet",
      owner: wallet,
    });

    const [mintA, mintB] = sortPubkeys([from.toString(), to.toString()]);

    const config = await this.getConfig();

    const program = new LegacyProgam<RaydiumCpSwap>(
      IDL as any,
      CREATE_CPMM_POOL_PROGRAM,
      new AnchorProvider(this.connection, {} as any, {})
    );

    const pda = getAmmPda(config.index, CREATE_CPMM_POOL_PROGRAM);

    const pool = getCpmmPoolPda(
      CREATE_CPMM_POOL_PROGRAM,
      new PublicKey(mintA),
      new PublicKey(mintB),
      pda
    );

    const tokenInfo = await this.raydium.token.getTokenInfo(from);

    const parsedAmount = new BN(amount * 10 ** tokenInfo.decimals);

    const poolAcc = await program.account.poolState.fetch(pool);

    if (!poolAcc) {
      throw new Error("Pool does not exist for this token!");
    }

    const data = await this.raydium.cpmm.getPoolInfoFromRpc(pool.toString());

    const poolInfo = data.poolInfo;

    const baseIn = from.toString() === poolInfo.mintA.address;

    const rpcData = await this.raydium.cpmm.getRpcPoolInfo(poolInfo.id, true);

    const swapResult = CurveCalculator.swap(
      parsedAmount,
      baseIn ? rpcData.baseReserve : rpcData.quoteReserve,
      baseIn ? rpcData.quoteReserve : rpcData.baseReserve,
      rpcData.configInfo!.tradeFeeRate
    );

    const { builder } = await this.raydium.cpmm.swap({
      poolInfo,
      inputAmount: parsedAmount,
      payer: wallet,
      txVersion: TxVersion.V0,
      swapResult,
      slippage: slippage / 100,
      baseIn,
      computeBudgetConfig: {
        units: 600000,
        microLamports: priorityFee * LAMPORTS_PER_SOL,
      },
    });

    const instructions: TransactionInstruction[] = [];

    instructions.push(...builder.allInstructions);

    const transaction = await createTransaction(
      this.connection,
      wallet,
      instructions
    );

    return transaction;
  }

  private get raydiumProgramId() {
    return this.cluster === "devnet"
      ? DEVNET_PROGRAM_ID.CREATE_CPMM_POOL_PROGRAM
      : CREATE_CPMM_POOL_PROGRAM;
  }

  private get poolFee() {
    return this.cluster === "devnet"
      ? DEVNET_PROGRAM_ID.CREATE_CPMM_POOL_FEE_ACC
      : CREATE_CPMM_POOL_FEE_ACC;
  }
}
