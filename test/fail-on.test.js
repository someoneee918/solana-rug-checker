import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { parseFailOn } from "../lib/cli.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const binPath = path.join(root, "bin", "rug-check.js");

test("parseFailOn returns 60 when undefined", () => {
  assert.equal(parseFailOn(undefined), 60);
});

test("parseFailOn accepts valid integers 0 and 100", () => {
  assert.equal(parseFailOn("0"), 0);
  assert.equal(parseFailOn(0), 0);
  assert.equal(parseFailOn("60"), 60);
  assert.equal(parseFailOn("100"), 100);
  assert.equal(parseFailOn(100), 100);
});

test("parseFailOn rejects non-numeric, boolean, and out-of-range values", () => {
  assert.throws(() => parseFailOn("abc"), /--fail-on must be a whole number/);
  assert.throws(() => parseFailOn(true), /--fail-on must be a whole number/);
  assert.throws(() => parseFailOn(false), /--fail-on must be a whole number/);
  assert.throws(() => parseFailOn("101"), /--fail-on must be between 0 and 100/);
  assert.throws(() => parseFailOn("-1"), /--fail-on must be a whole number/);
  assert.throws(() => parseFailOn("42.5"), /--fail-on must be a whole number/);
});

test("CLI rejects invalid --fail-on with exit code 1 before network calls", () => {
  const dummyMint = "So11111111111111111111111111111111111111112";
  const resAbc = spawnSync(process.execPath, [binPath, dummyMint, "--fail-on", "abc"], { encoding: "utf8" });
  assert.equal(resAbc.status, 1);
  assert.match(resAbc.stderr, /--fail-on must be a whole number/);

  const resTrue = spawnSync(process.execPath, [binPath, dummyMint, "--fail-on"], { encoding: "utf8" });
  assert.equal(resTrue.status, 1);
  assert.match(resTrue.stderr, /--fail-on must be a whole number/);

  const res101 = spawnSync(process.execPath, [binPath, dummyMint, "--fail-on", "101"], { encoding: "utf8" });
  assert.equal(res101.status, 1);
  assert.match(res101.stderr, /--fail-on must be between 0 and 100/);
});
