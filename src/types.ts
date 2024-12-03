import { BN } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";

export type Cluster = "devnet" | "mainnet";

export type BondingCurve = {
  mint: PublicKey;
  virtualTokenReserve: BN;
  virtualSolReserve: BN;
  realSolReserve: BN;
  realTokenReserve: BN;
  completed: boolean;
  bump: number;
  createdAt: BN;
  creator: PublicKey;
};

export type GlobalData = {
  authority: PublicKey;
  treasuryWallet: PublicKey;
  feeWallet: PublicKey;
  feeBps: number;
  rewardHoldUp: BN;
  rewardConfig: any[];
};

export type PurchaseCurrency = "token" | "sol";

export type TradeType = "buy" | "sell";

export type FomoEvent =
  | "fundsWithdrawn"
  | "tokenCreated"
  | "tokenBonded"
  | "tokenPurchase"
  | "tokenSale";

export interface FundsWithdrawnEvent {
  token: PublicKey;
  solAmount: BN;
  tokenAmount: BN;
}

export interface IFomoEvent {}

export interface TokenCreatedEvent extends IFomoEvent {
  name: string;
  symbol: string;
  mint: PublicKey;
  creator: PublicKey;
  requiredLiquidity: BN;
  createdAt: BN;
}

export interface TokenBondedEvent {
  token: PublicKey;
  bondingCurve: PublicKey;
  accumulatedSol: BN;
}

export interface TokenPurchaseEvent {
  token: PublicKey;
  virtualTokenReserve: BN;
  realTokenReserve: BN;
  virtualSolReserve: BN;
  realSolReserve: BN;
  isCompleted: boolean;
  bondingCurve: PublicKey;
  buyer: PublicKey;
  boughtAmount: BN;
}

export interface TokenSaleEvent {
  token: PublicKey;
  virtualTokenReserve: BN;
  realTokenReserve: BN;
  virtualSolReserve: BN;
  realSolReserve: BN;
  isCompleted: boolean;
  bondingCurve: PublicKey;
  seller: PublicKey;
  soldAmount: BN;
}

export type FomoEventMapping = {
  fundsWithdrawn: FundsWithdrawnEvent;
  tokenCreated: TokenCreatedEvent;
  tokenBonded: TokenBondedEvent;
  tokenPurchase: TokenPurchaseEvent;
  tokenSale: TokenSaleEvent;
};
