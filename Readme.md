# Fomo Token Trading Class

## Description

A Solana blockchain utility for token trading, creation, and interaction with a custom bonding curve mechanism.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Methods](#methods)
- [Configuration](#configuration)
- [Dependencies](#dependencies)

## Installation

Install the required dependencies:

```bash
npm install @solana/web3.js @coral-xyz/anchor
```

## Usage

### Initialization

```typescript
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
const cluster = "devnet"; // or 'mainnet-beta'
const authority = Keypair.generate(); // Optional

const fomo = new Fomo(connection, cluster, authority);
```

### Buying Tokens

```typescript
const versionedTx = await fomo.buyToken(
  wallet.publicKey, // Buyer's wallet
  tokenMint, // Token mint address
  amount, // Amount to spend
  slippage, // Slippage tolerance
  priorityFee, // Network priority fee
  "sol" // Purchase currency
);

const { blockhash } = await this.connection.getLatestBlockhash()
versionedTx.message.recentBlockhash = blockhash

const serializedTransaction = versionedTx.serialize()
const serializedTransactionBase64 = Buffer.from(serializedTransaction).toString('base64')

const deserializedTx = VersionedTransaction.deserialize(Buffer.from(serializedTransactionBase64, 'base64'))

const signedTx = await walletInstance.signTransaction(deserializedTx)
const txHash = await fomo.sendTransaction(connection, signedTx)
```

### Selling Tokens

```typescript
const versionedTx = await fomo.sellToken(
  wallet.publicKey, // Seller's wallet
  tokenMint, // Token mint address
  amount, // Amount to sell
  slippage, // Slippage tolerance
  priorityFee, // Network priority fee
  "token" // Sell currency type
);

const { blockhash } = await this.connection.getLatestBlockhash()
versionedTx.message.recentBlockhash = blockhash

const serializedTransaction = versionedTx.serialize()
const serializedTransactionBase64 = Buffer.from(serializedTransaction).toString('base64')

const deserializedTx = VersionedTransaction.deserialize(Buffer.from(serializedTransactionBase64, 'base64'))

const signedTx = await walletInstance.signTransaction(deserializedTx)
const txHash = await fomo.sendTransaction(connection, signedTx)
```

### Creating a Token

```typescript
const priorityFee = 0.001
const requiredLiquidity = 27
const initialBuy = 0
const keypairBytes = Uint8Array.from([...])
const mintKeypairSecret = Keypair.fromSecretKey(keypairBytes)

const { transaction: versionedTx } = await fomo.createToken(
  wallet.publicKey, // Creator's wallet
  "TokenName", // Token name
  "Symbol", // Token symbol
  "https://metadata.uri", // Metadata URI
  priorityFee, // Network priority fee
  bs58.encode(mintKeypairSecret.secretKey), // Mint keypair secret
  requiredLiquidity, // Optional liquidity requirement | Default: 85
  initialBuy, // Optional | Default: 0
);

const { blockhash } = await this.connection.getLatestBlockhash()
versionedTx.message.recentBlockhash = blockhash
versionedTx.sign([mintKeypairSecret])

const serializedTransaction = versionedTx.serialize()
const serializedTransactionBase64 = Buffer.from(serializedTransaction).toString('base64')

const deserializedTx = VersionedTransaction.deserialize(Buffer.from(serializedTransactionBase64, 'base64'))

const signedTx = await walletInstance.signTransaction(deserializedTx)
const txHash = await fomo.sendTransaction(connection, signedTx)
```

### Trade on Raydium

```typescript
const priorityFee = 0.001
const slippage = 0.5
const amountToTrade = 1_000_000

const versionedTx = await fomo.trade(
  wallet.publicKey, // Creator's wallet
  priorityFee, // Network priority fee
  amountToTrade, //Amount of X token to trade
  new PublicKey("from"), //From token address
  new PublicKey("to"), //To token address
  slippage, //slippage tolerance
);

const serializedTransaction = versionedTx.serialize()
const serializedTransactionBase64 = Buffer.from(serializedTransaction).toString('base64')

const deserializedTx = VersionedTransaction.deserialize(Buffer.from(serializedTransactionBase64, 'base64'))

const signedTx = await walletInstance.signTransaction(deserializedTx)
const txHash = await fomo.sendTransaction(connection, signedTx)
```

### Calculate Price

```typescript
const { virtualSolReserve, virtualTokenReserve, realSolReserve, realTokenReserve } = await fomo.getBondingCurve(new PublicKey("Token Address"))

const price = fomo.calculatePrice(virtualSolReserve, virtualTokenReserve, realSolReserve, realTokenReserve)
```

## Methods


| Method              | Description                   | Parameters                                                                                        |
| ------------------- | ----------------------------- |---------------------------------------------------------------------------------------------------|
| `buyToken()`        | Purchase tokens               | `wallet`, `tokenMint`, `amount`, `slippage`, `priorityFee`, `purchaseCurrency`                    |
| `sellToken()`       | Sell tokens                   | `wallet`, `tokenMint`, `amount`, `slippage`, `priorityFee`, `sellCurrency`                        |
| `createToken()`     | Launch new token              | `wallet`, `name`, `symbol`, `uri`, `priorityFee`, `mintKeypair`, `requiredLiquidity`, `initialBuy`|
| `getGlobalData()`   | Retrieve global contract data | -                                                                                                 |
| `getBondingCurve()` | Get bonding curve details     | `tokenMint`                                                                                       |
| `calculatePrice()`  | Getting a price               | `virtualSolReserve`, `virtualTokenReserve`, `realSolReserve`, `realTokenReserve`                  |
| `trade()`           | Trade token on Raydium        | `wallet`, `priorityFee`, `amountToTrade`, `fromTokenMint`, `toTokenMint`, `slippage`   |

## Configuration

- Supports devnet and mainnet clusters
- Configurable priority fees
- Slippage control
- Multiple purchase/sell currencies

## Dependencies

- `@solana/web3.js`
- `@coral-xyz/anchor`
- Solana Token Metadata Program

## Error Handling

```typescript
try {
  const transaction = await fomo.buyToken(...);
  // Send and confirm transaction
} catch (error) {
  console.error('Transaction failed:', error);
}
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the [Your License]. See `LICENSE` for more information.

## Contact

[Your Name] - [Your Email]

Project Link: [Repository URL]
