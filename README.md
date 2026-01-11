# Cyrus.Cash Web

The official website for the CYRUS token - honoring Cyrus the Great, the Father of Human Rights.

## Features

- **Quadratic Bonding Curve**: Price starts at $0.01 and rises to $1.00 (100X)
- **USDT Payments**: Buy with USDT on Base network
- **Early Buyer Advantage**: Quadratic curve rewards early participants
- **Real-time Price Display**: See current price and tokens sold
- **Wallet Integration**: Connect with MetaMask, Coinbase Wallet, etc.

## Tech Stack

- **React 18** + TypeScript
- **Vite** - Build tool
- **wagmi** + **viem** - Web3 integration
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Framer Motion** - Animations

## Development

```bash
# Install dependencies
npm install

# Run local dev server (connects to production)
npm run dev

# Run local dev server with Anvil (local blockchain)
VITE_LOCAL=true npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Local Testing with Anvil

1. Start Anvil (from token directory):
   ```bash
   cd ../token
   anvil --host 127.0.0.1 --port 8545 --chain-id 31337
   ```

2. Deploy contracts locally:
   ```bash
   npx hardhat run scripts/deploy-local.js --network localhost
   ```

3. Start web with local mode:
   ```bash
   VITE_LOCAL=true npm run dev
   ```

4. Add Anvil network to MetaMask:
   - Network Name: `Localhost`
   - RPC URL: `http://127.0.0.1:8545`
   - Chain ID: `31337`
   - Currency: `ETH`

5. Import test wallet:
   - Private Key: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_LOCAL` | Use local Anvil chain | `false` |

## Project Structure

```
src/
├── components/     # React components
│   ├── ui/        # shadcn/ui components
│   └── ...        # Feature components
├── lib/           # Utilities and config
│   └── wagmi.ts   # Web3 config and ABIs
├── pages/         # Page components
└── main.tsx       # Entry point
```

## Contract Integration

The web app interacts with:
- **CYRUS Token**: Bonding curve sale contract
- **USDT**: Payment token (USDbC on Base)

Key functions:
- `buy(usdtAmount)` - Purchase CYRUS with USDT
- `getCurrentPrice()` - Get current price in USDT
- `calculateTokensForUsdt(amount)` - Preview tokens for USDT amount
- `tokensSold` - Total tokens sold
- `saleActive` - Sale status

## Links

- Website: https://cyrus.cash
- Token Contract: [Basescan](https://basescan.org)
- GitHub: https://github.com/luxdao/cyrus

---

*Freedom. Tolerance. Dignity. Justice.*
