#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { c, footer, isAddress, main, parseArgs, price, usd, age } from "../lib/core.js";
import { assess, gather } from "../lib/assess.js";

const HELP = `solana-rug-checker: rug pull scanner for Solana and pump.fun tokens

Usage:
  rug-check <mint> [<mint> ...] [options]

Options:
  --json          Print the full result as JSON
  --fail-on <n>   Exit with code 2 when the risk score is n or higher (default 60)
  --version       Show version
  --help          Show this help

Risk score: 0 to 24 low, 25 to 59 caution, 60 to 100 high.
`;

const ICON = { danger: c.red("✖"), warn: c.yellow("▲"), ok: c.green("✔") };

main(async () => {
  const args = parseArgs(process.argv.slice(2), { booleans: ["json", "help", "version"] });
  if (args.version) {
    const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
    console.log(pkg.version);
    process.exit(0);
  }
  if (args.help || !args._.length) { console.log(HELP); process.exit(args.help ? 0 : 1); }
  const failOn = Number(args["fail-on"]) || 60;
  const results = [];
  for (const mint of args._) {
    if (!isAddress(mint)) throw new Error(`"${mint}" is not a Solana address.`);
    const data = await gather(mint);
    if (!data.mintInfo && !data.report) throw new Error(`Could not load ${mint} from any source (${data.unavailable.join(", ")} unavailable).`);
    const result = assess(data);
    const name = data.report?.tokenMeta?.name || data.pair?.baseToken?.name || "Unknown token";
    const symbol = data.report?.tokenMeta?.symbol || data.pair?.baseToken?.symbol || "?";
    results.push({ mint, name, symbol, ...result, unavailable: data.unavailable, market: data.pair && { dex: data.pair.dexId, priceUsd: Number(data.pair.priceUsd), liquidityUsd: data.pair.liquidity?.usd, marketCap: data.pair.marketCap ?? data.pair.fdv, url: data.pair.url } });
    if (args.json) continue;

    const colour = result.score >= 60 ? c.red : result.score >= 25 ? c.yellow : c.green;
    console.log(`\n${c.bold(`${name} (${symbol})`)}  ${c.dim(mint)}`);
    if (data.pair) {
      const p = data.pair;
      console.log(c.dim(`${price(p.priceUsd)}  ·  mcap ${usd(p.marketCap ?? p.fdv)}  ·  liquidity ${p.liquidity?.usd == null ? "bonding curve" : usd(p.liquidity.usd)}  ·  24h volume ${usd(p.volume?.h24)}  ·  age ${p.pairCreatedAt ? age(Date.now() - p.pairCreatedAt) : "-"}  ·  ${data.report?.totalHolders != null ? Number(data.report.totalHolders).toLocaleString() + " holders" : ""}`));
    }
    console.log(`\nRisk score ${colour(c.bold(`${result.score}/100`))}  ${colour(result.verdict)}\n`);
    for (const f of result.findings) console.log(`  ${ICON[f.level]} ${f.level === "ok" ? f.title : c.bold(f.title)}\n    ${c.dim(f.detail)}`);
    if (data.unavailable.length) console.log(c.yellow(`\n  Not checked: ${data.unavailable.join(", ")} did not respond, so the score may be too low.`));
  }
  if (args.json) console.log(JSON.stringify(results.length === 1 ? results[0] : results, null, 2));
  else {
    console.log(c.dim("\nA low score is not a guarantee. This checks the contract and the holders, not the team."));
    footer("/rug-pull-scanner", "Dev history, bundle detection and live dump warnings");
  }
  if (results.some((r) => r.score >= failOn)) process.exitCode = 2;
});
