import { AnchorProvider, BN, Program } from "@coral-xyz/anchor";
import {
  Cluster,
  ComputeBudgetProgram,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  SYSVAR_INSTRUCTIONS_PUBKEY,
  TransactionInstruction,
} from "@solana/web3.js";
import { FomoContract as FomoContractDevnet } from "./idl/fomo_contract.devnet";

import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import IDLDevnet from "./idl/fomo.idl.devnet.json";
import IDLMainnet from "./idl/fomo.idl.devnet.json";

import { getBondingPda, getGlobalPda } from "./pda";
import { BondingCurve, GlobalData, PurchaseCurrency, TradeType } from "./types";
import {
  DENOMINATOR,
  editionSeed,
  metadataSeed,
  TOKEN_METADATA_PROGRAM_ID,
} from "./constants";
import { createTransaction } from "./transaction";
import { FomoEvents } from "./events";
import { FomoRaydium } from "./raydium";
import {
  createAssociatedTokenAccountInstruction,
  createInitializeMintInstruction,
  getAssociatedTokenAddressSync,
  MintLayout,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { ASSOCIATED_PROGRAM_ID } from "coral-xyz3/dist/cjs/utils/token";

export class Fomo {
  program: Program<FomoContractDevnet>;
  private connection: Connection;
  private authority?: Keypair | undefined;
  raydium: FomoRaydium;
  events: FomoEvents;
  SCALE_FACTOR = 1.70583785146;
  TOTAL_SUPPLY = 1000000000000000;

  constructor(connection: Connection, cluster: Cluster, authority?: Keypair) {
    this.program = new Program<FomoContractDevnet>(
      (cluster === "devnet" ? IDLDevnet : IDLMainnet) as FomoContractDevnet,
      new AnchorProvider(connection, {} as any)
    );
    this.authority = authority;
    this.connection = connection;
    this.events = new FomoEvents(this.program);
    this.raydium = new FomoRaydium(
      this.connection,
      cluster,
      this.program,
      authority
    );
  }

  async buyToken(
    wallet: PublicKey,
    tokenMint: PublicKey,
    amount: number,
    slippage: number,
    priorityFee: number,
    purchaseCurrency: PurchaseCurrency
  ) {
    const instructions: TransactionInstruction[] = [
      ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: priorityFee * LAMPORTS_PER_SOL,
      }),
    ];
    const global = await this.getGlobalData();

    const bondingCurve = await this.getBondingCurve(tokenMint);

    let [buyAmount, slippageAmount] = this.calculateTradePrice(
      bondingCurve,
      amount,
      purchaseCurrency,
      "buy",
      slippage
    );

    if (buyAmount > bondingCurve.realTokenReserve.toNumber() / DENOMINATOR) {
      buyAmount = bondingCurve.realTokenReserve.toNumber() / DENOMINATOR;
    }

    const buyIx = await this.program.methods
      .buy(
        new BN(buyAmount * DENOMINATOR),
        new BN(slippageAmount * LAMPORTS_PER_SOL)
      )
      .accounts({
        feeWallet: global.feeWallet,
        payer: wallet,
        mint: tokenMint,
      })
      .instruction();

    instructions.push(buyIx);

    return await createTransaction(this.connection, wallet, instructions);
  }

  async calculateTokenAmountForSol(
    solAmount: number,
    mint: PublicKey,
    action: "buy" | "sell"
  ) {
    const curve = await this.getBondingCurve(mint);

    const [buyAmount] = this.calculateTradePrice(
      curve,
      solAmount,
      "sol",
      action,
      10
    );

    return buyAmount;
  }

  async sellToken(
    wallet: PublicKey,
    tokenMint: PublicKey,
    amount: number,
    slippage: number,
    priorityFee: number,
    sellCurrency: PurchaseCurrency
  ) {
    const instructions: TransactionInstruction[] = [
      ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: priorityFee * LAMPORTS_PER_SOL,
      }),
    ];

    const global = await this.getGlobalData();
    const bondingCurve = await this.getBondingCurve(tokenMint);

    const [tokenAmount, slippageAmount] = this.calculateTradePrice(
      bondingCurve,
      amount,
      sellCurrency,
      "sell",
      slippage
    );

    const ix = await this.program.methods
      .sell(
        new BN(tokenAmount * DENOMINATOR),
        new BN(slippageAmount * LAMPORTS_PER_SOL)
      )
      .accounts({
        feeWallet: global.feeWallet,
        mint: tokenMint,
        payer: wallet,
      })
      .instruction();

    instructions.push(ix);

    return await createTransaction(this.connection, wallet, instructions);
  }

  async createToken(
    wallet: PublicKey,
    name: string,
    symbol: string,
    uri: string,
    priorityFee: number,
    mintKeypair: string,
    requiredLiquidity = 85,
    initialBuy?: number
  ) {
    const instructions: TransactionInstruction[] = [
      ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: priorityFee * LAMPORTS_PER_SOL,
      }),
    ];
    const global = await this.getGlobalData();
    const mint = Keypair.fromSecretKey(bs58.decode(mintKeypair));

    const createMintAccount = SystemProgram.createAccount({
      fromPubkey: wallet,
      lamports: await this.connection.getMinimumBalanceForRentExemption(
        MintLayout.span
      ),
      newAccountPubkey: mint.publicKey,
      programId: TOKEN_PROGRAM_ID,
      space: MintLayout.span,
    });
    const bc = getBondingPda(mint.publicKey, this.program.programId);

    instructions.push(createMintAccount);

    instructions.push(
      createInitializeMintInstruction(mint.publicKey, 6, bc, null)
    );

    const bondingAta = getAssociatedTokenAddressSync(mint.publicKey, bc, true);
    const createBondingAta = createAssociatedTokenAccountInstruction(
      wallet,
      bondingAta,
      bc,
      mint.publicKey,
      TOKEN_PROGRAM_ID
    );

    instructions.push(createBondingAta);

    const treasuryAta = getAssociatedTokenAddressSync(
      mint.publicKey,
      global.treasuryWallet,
      true,
      TOKEN_PROGRAM_ID
    );

    const createTreasuryAta = createAssociatedTokenAccountInstruction(
      wallet,
      treasuryAta,
      global.treasuryWallet,
      mint.publicKey
    );

    instructions.push(createTreasuryAta);

    const [metadata] = PublicKey.findProgramAddressSync(
      [
        metadataSeed,
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mint.publicKey.toBuffer(),
      ],
      TOKEN_METADATA_PROGRAM_ID
    );

    const [edition] = PublicKey.findProgramAddressSync(
      [
        metadataSeed,
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mint.publicKey.toBuffer(),
        editionSeed,
      ],
      TOKEN_METADATA_PROGRAM_ID
    );

    const ix = await this.program.methods
      .create(name, symbol, uri, new BN(requiredLiquidity * LAMPORTS_PER_SOL))
      .accounts({
        sysvarInstructions: SYSVAR_INSTRUCTIONS_PUBKEY,
        masterEdition: edition,
        metadata,
        treasury: global.treasuryWallet,
        mint: mint.publicKey,
        payer: wallet,
        treasuryAta,
        bondingAta,
        createSolFeeDest: global.createSolDestination,
      })
      .instruction();

    instructions.push(ix);

    let tokenAm: number | undefined;

    if (initialBuy) {
      const vsol = new BN(
        requiredLiquidity * LAMPORTS_PER_SOL * (this.SCALE_FACTOR - 1) +
          initialBuy * LAMPORTS_PER_SOL
      );
      const realTok = new BN(this.TOTAL_SUPPLY * 0.8);
      const rsol = new BN(initialBuy * LAMPORTS_PER_SOL);
      const vrs = new BN(realTok.toNumber() * this.SCALE_FACTOR);

      const price = this.calculatePrice(vsol, vrs, rsol, realTok);

      const tokenAmount = initialBuy / price;

      const tok = new BN(tokenAmount * DENOMINATOR);

      tokenAm = tokenAmount;

      const buyIx = await this.program.methods
        .buy(tok, new BN((initialBuy + 1) * LAMPORTS_PER_SOL))
        .accountsPartial({
          feeWallet: global.feeWallet,
          mint: mint.publicKey,
          payer: wallet,
          associatedTokenProgram: ASSOCIATED_PROGRAM_ID,
          global: getGlobalPda(this.program.programId),
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
          bondingCurve: getBondingPda(mint.publicKey, this.program.programId),
          bondingAta: getAssociatedTokenAddressSync(
            mint.publicKey,
            getBondingPda(mint.publicKey, this.program.programId),
            true
          ),
          userAta: getAssociatedTokenAddressSync(mint.publicKey, wallet),
          creatorData: PublicKey.findProgramAddressSync(
            [
              Buffer.from("creator"),
              wallet.toBuffer(),
              mint.publicKey.toBuffer(),
            ],
            this.program.programId
          )[0],
        })
        .instruction();

      instructions.push(buyIx);
    }

    return {
      tokenAmount: tokenAm,
      transaction: await createTransaction(
        this.connection,
        wallet,
        instructions
      ),
    };
  }

  async getGlobalData() {
    const global = getGlobalPda(this.program.programId);
    return this.program.account.globalData.fetch(global);
  }

  async getBondingCurve(tokenMint: PublicKey): Promise<BondingCurve> {
    const pda = getBondingPda(tokenMint, this.program.programId);
    const bondingCurve = await this.program.account.bondingCurve.fetch(pda);
    return bondingCurve;
  }

  calculatePrice(
    virtualSolReserve: BN,
    virtualTokenReserve: BN,
    realSolReserve: BN,
    realTokenReserve: BN
  ): number {
    const totalSolReserves = virtualSolReserve.add(realSolReserve).toNumber();
    const solInDecimal = totalSolReserves / LAMPORTS_PER_SOL;

    const totalTokenReserves = virtualTokenReserve
      .add(realTokenReserve)
      .toNumber();
    const tokenInDecimal = totalTokenReserves / DENOMINATOR;

    return solInDecimal / tokenInDecimal;
  }

  private calculateSlippage(
    solAmount: number,
    slippage: number,
    tradeType: TradeType
  ) {
    const sl = solAmount * (slippage / 100);
    if (tradeType === "buy") {
      return solAmount + sl;
    }
    return solAmount - sl;
  }

  private calculateTradePrice(
    bondingCurve: BondingCurve,
    purchaseAmount: number,
    purchaseCurrency: PurchaseCurrency,
    tradeType: TradeType,
    slippage: number
  ) {
    let virtualTokenReserve = bondingCurve.virtualTokenReserve;
    let virtualSolReserve = bondingCurve.virtualSolReserve;
    let realSolReserve = bondingCurve.realSolReserve;
    let realTokenReserve = bondingCurve.realTokenReserve;

    switch (purchaseCurrency) {
      case "sol": {
        switch (tradeType) {
          case "buy": {
            virtualSolReserve = virtualSolReserve.add(
              new BN(purchaseAmount * LAMPORTS_PER_SOL)
            );
            realSolReserve = realSolReserve.add(
              new BN(purchaseAmount * LAMPORTS_PER_SOL)
            );

            const price = this.calculatePrice(
              virtualSolReserve,
              virtualTokenReserve,
              realSolReserve,
              realTokenReserve
            );

            const calculatedSlippage = this.calculateSlippage(
              purchaseAmount,
              slippage,
              "buy"
            );
            let tokenAmount = purchaseAmount / price;

            if (tokenAmount > realTokenReserve.toNumber() / DENOMINATOR) {
              tokenAmount = realTokenReserve.toNumber() / DENOMINATOR;
            }

            return [tokenAmount, calculatedSlippage];
          }
          case "sell": {
            virtualSolReserve = virtualSolReserve.sub(
              new BN(purchaseAmount * LAMPORTS_PER_SOL)
            );
            realSolReserve = realSolReserve.sub(
              new BN(purchaseAmount * LAMPORTS_PER_SOL)
            );
            const price = this.calculatePrice(
              virtualSolReserve,
              virtualTokenReserve,
              realSolReserve,
              realTokenReserve
            );
            const calculatedSlippage = this.calculateSlippage(
              purchaseAmount,
              slippage,
              "sell"
            );
            const tokenAmount = purchaseAmount / price;
            return [tokenAmount, calculatedSlippage];
          }
        }
      }
      case "token": {
        switch (tradeType) {
          case "buy": {
            virtualTokenReserve = virtualTokenReserve.sub(
              new BN(purchaseAmount * DENOMINATOR)
            );
            realTokenReserve = realTokenReserve.sub(
              new BN(purchaseAmount * DENOMINATOR)
            );

            let price = this.calculatePrice(
              virtualSolReserve,
              virtualTokenReserve,
              realSolReserve,
              realTokenReserve
            );

            let solTransfer = price * purchaseAmount;
            const calculatedSlippage = this.calculateSlippage(
              solTransfer,
              slippage,
              "buy"
            );

            return [purchaseAmount, calculatedSlippage];
          }
          case "sell": {
            virtualTokenReserve = virtualTokenReserve.add(
              new BN(purchaseAmount * DENOMINATOR)
            );
            realTokenReserve = realTokenReserve.add(
              new BN(purchaseAmount * DENOMINATOR)
            );
            let price = this.calculatePrice(
              virtualSolReserve,
              virtualTokenReserve,
              realSolReserve,
              realTokenReserve
            );

            let solTransfer = price * purchaseAmount;
            const calculatedSlippage = this.calculateSlippage(
              solTransfer,
              slippage,
              "sell"
            );
            return [purchaseAmount, calculatedSlippage];
          }
        }
      }
    }
  }
}
