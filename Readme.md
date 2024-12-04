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
await fomo.buyToken(
  wallet.publicKey, // Buyer's wallet
  tokenMint, // Token mint address
  amount, // Amount to spend
  slippage, // Slippage tolerance
  priorityFee, // Network priority fee
  "sol" // Purchase currency
);
```

### Selling Tokens

```typescript
await fomo.sellToken(
  wallet.publicKey, // Seller's wallet
  tokenMint, // Token mint address
  amount, // Amount to sell
  slippage, // Slippage tolerance
  priorityFee, // Network priority fee
  "token" // Sell currency type
);
```

### Creating a Token

```typescript
const priorityFee = 0.001
const requiredLiquidity = 27
const initialBuy = 0
const keypairBytes = Uint8Array.from([...])
const mintKeypairSecret = Keypair.fromSecretKey(keypairBytes)

const { transaction: tx } = await fomo.createToken(
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
tx.message.recentBlockhash = blockhash
tx.sign([mintKeypairSecret])

const serializedTransaction = tx.serialize()
const serializedTransactionBase64 = Buffer.from(serializedTransaction).toString('base64')
```

## Methods

| Method              | Description                   | Parameters                                                                             |
| ------------------- | ----------------------------- |----------------------------------------------------------------------------------------|
| `buyToken()`        | Purchase tokens               | `wallet`, `tokenMint`, `amount`, `slippage`, `priorityFee`, `purchaseCurrency`         |
| `sellToken()`       | Sell tokens                   | `wallet`, `tokenMint`, `amount`, `slippage`, `priorityFee`, `sellCurrency`             |
| `createToken()`     | Launch new token              | `wallet`, `name`, `symbol`, `uri`, `priorityFee`, `mintKeypair`, `requiredLiquidity`, `initialBuy` |
| `getGlobalData()`   | Retrieve global contract data | -                                                                                      |
| `getBondingCurve()` | Get bonding curve details     | `tokenMint`                                                                            |

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
