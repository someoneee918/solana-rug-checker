# Solana Rug Checker

Rug pull scanner for Solana and pump.fun tokens. Checks the contract, the holders and the liquidity, and gives a 0 to 100 risk score with a plain-English reason for every point.

![Node 22+](https://img.shields.io/badge/node-%E2%89%A522-5FA04E?logo=node.js&logoColor=white) ![Dependencies: 0](https://img.shields.io/badge/dependencies-0-2ea44f) [![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE) [![Website](https://img.shields.io/badge/website-blixtrade.github.io-8b5cf6)](https://blixtrade.github.io/solana-rug-checker/)

> Free and open source, part of the [Blix Trade](https://github.com/blixtrade) toolkit. For the live version with AI ratings on every coin, wallet tracking and one-click trading at 0% fees, see **[BLIX, the Solana memecoin terminal](https://blixvip.com/rug-pull-scanner?utm_source=github&utm_medium=readme&utm_campaign=solana-rug-checker)**.

## What it does

- Mint authority and freeze authority, read straight from the chain.
- Token-2022 traps: transfer taxes, permanent delegates (an authority that can take tokens from any wallet), transfer hooks, non-transferable tokens and frozen-by-default accounts.
- Holder concentration with pools left out, insider-flagged holders, and how much the creator still holds.
- Liquidity of the deepest pool, pool age, and the honeypot pattern (plenty of buys, zero sells).
- Coins still on the pump.fun bonding curve are recognised and not mistaken for zero liquidity.
- Exit code 2 when the score is at or above `--fail-on`, so you can use it in scripts and bots.

## Quick start

You need [Node.js](https://nodejs.org) 22 or newer. There is nothing else to install: no dependencies, no API keys.

Run it straight from GitHub:

```bash
npx -y github:blixtrade/solana-rug-checker <mint>
```

Or clone it:

```bash
git clone https://github.com/blixtrade/solana-rug-checker.git
cd solana-rug-checker
node bin/rug-check.js <mint>
```

To get a `rug-check` command on your PATH, run `npm link` inside the folder.

## Example output

Real output from a run on 18 November 2026:

```text
DacityCoin (DCTY)  9hjBLBrc7WZW2H8UQvBAvG5WiTZotXUv2Bdcn4f4pump
$0.01362  ·  mcap $12.89M  ·  liquidity $448.6K  ·  24h volume $32.60M  ·  age 30d  ·  38,388 holders

Risk score 5/100  LOW RISK

  ▲ Insider network of 52 wallets
    RugCheck found wallets connected by transfers around the launch.
  ✔ Mint authority revoked
    No new tokens can be created.
  ✔ Freeze authority revoked
    Wallets cannot be frozen.
  ✔ Top 10 wallets hold 15.9%
    Supply is spread out.
  ✔ Creator holds 0%
    The deployer wallet holds none of the supply (sold or never bought).
  ✔ Liquidity is $448,583
    Deepest pool is on pumpswap.

A low score is not a guarantee. This checks the contract and the holders, not the team.
```

## Options

```text
solana-rug-checker: rug pull scanner for Solana and pump.fun tokens

Usage:
  rug-check <mint> [<mint> ...] [options]

Options:
  --json          Print the full result as JSON
  --fail-on <n>   Exit with code 2 when the risk score is n or higher (default 60)
  --version       Show version
  --help          Show this help

Risk score: 0 to 24 low, 25 to 59 caution, 60 to 100 high.
```

## How it works

- Three sources are read in parallel: the Solana RPC (mint account and extensions), RugCheck (holders, insiders, extra risks) and DexScreener (pools and trading activity).
- If one source is down, the check still runs on the other two and says what was not checked.
- Each finding adds points; the score is capped at 100. 0 to 24 is low, 25 to 59 caution, 60 and up high risk.

## Limits

- A low score is not a guarantee. It checks the contract and the holders, not the team, the narrative or a coordinated dump.
- Holder data comes from RugCheck and can lag the chain by a few minutes on brand-new coins.

## Development

```bash
npm test
```

Tests run offline against fixtures, so they never depend on a live API.

## Contributing

Pull requests are welcome, and first-timers are too. Pick an issue labelled [good first issue](https://github.com/blixtrade/solana-rug-checker/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) or [help wanted](https://github.com/blixtrade/solana-rug-checker/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22), comment that you are taking it, and read [CONTRIBUTING.md](CONTRIBUTING.md). No API keys needed: the tests run offline.

[![Contributors](https://contrib.rocks/image?repo=blixtrade/solana-rug-checker)](https://github.com/blixtrade/solana-rug-checker/graphs/contributors)

## More free Solana tools from Blix Trade

| Tool | What it does |
|---|---|
| [solana-bubble-map](https://github.com/blixtrade/solana-bubble-map) | Holder bubble map for any Solana or pump.fun token. |
| [pump-fun-tracker](https://github.com/blixtrade/pump-fun-tracker) | Every new pump.fun launch on Solana, live in your terminal, the moment it is created. |
| [solana-memecoin-screener](https://github.com/blixtrade/solana-memecoin-screener) | Screen trending, new and boosted Solana memecoins from the terminal. |
| [solana-wallet-tracker](https://github.com/blixtrade/solana-wallet-tracker) | Follow any Solana wallets and see every memecoin buy and sell they make: token, size in SOL and USD, and a Solscan link. |
| [solana-pnl-tracker](https://github.com/blixtrade/solana-pnl-tracker) | Profit and loss for any Solana wallet's memecoin trades, worked out from its on-chain transactions. |
| [solana-whale-tracker](https://github.com/blixtrade/solana-whale-tracker) | Big buys and sells on any Solana token: net whale flow, every large trade with a Solscan link, and leaderboards of the wallets buying and dumping the most. |
| [memecoin-paper-trading](https://github.com/blixtrade/memecoin-paper-trading) | Practise Solana memecoin trading with fake SOL at real prices. |
| [memecoin-alert-bot](https://github.com/blixtrade/memecoin-alert-bot) | pump.fun alerts in Telegram and Discord. |
| [pump-fun-mcp](https://github.com/blixtrade/pump-fun-mcp) | An MCP server that gives Claude, Cursor and other AI assistants six Solana memecoin research tools: token info, rug check, top holders, a screener, whale trades and wallet trades. |

Want all of this in one place, live, with AI on every coin? **[Open BLIX](https://blixvip.com/?utm_source=github&utm_medium=readme&utm_campaign=solana-rug-checker)**: the Solana memecoin terminal with 0% trading fees.

## Disclaimer

This is research software, not financial advice. Memecoins are extremely volatile and most go to zero. Never trade more than you can afford to lose. The data comes from free third-party APIs that can be wrong, late or unavailable.

## License

[MIT](LICENSE)
