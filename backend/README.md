# Vestra backend

Off-chain agent + scripts for the Vestra savings/credit agent on Celo.

## Register the agent on ERC-8004

This mints the Vestra agent identity (ERC-721) on the ERC-8004 Identity Registry
and makes it discoverable on [8004scan](https://8004scan.io). Do it first — all
reputation activity accrues to this `agentId`.

**1. Provide your credentials**

```bash
cp .env.example .env
```

Fill in `.env`:

- `PINATA_JWT` — from <https://pinata.cloud> → API Keys. Pins the agent
  metadata + logo to IPFS.
- `AGENT_PRIVATE_KEY` — a wallet private key (`0x` + 64 hex). Fund it with
  Alfajores test CELO for gas at <https://faucet.celo.org> (choose Alfajores).

**2. Install and register (testnet)**

```bash
npm install
npm run register:testnet
```

The script:

1. Checks the wallet is funded.
2. Pins `metadata/vestra-logo.png` + `metadata/vestra-agent.json` to IPFS.
3. Calls `register(agentURI)` on the Identity Registry.
4. Prints your `agentId` + 8004scan link and writes `agent.testnet.json`.

**Save the `agentId`** — reputation writes (next step) need it. It's also stored
in `agent.testnet.json` along with the registry addresses.

Mainnet (real funds, do this only after testnet works):

```bash
npm run register:mainnet
```

## What's next (not built yet)

Per `Vestra_PRD.md` §22: `SavingsVault` + `CreditModule` contracts → guarded
daily pull loop → reputation writes → Self gating → API + Telegram bot.
