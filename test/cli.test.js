import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const binPath = path.join(root, "bin", "rug-check.js");

test("node bin/rug-check.js --version prints package version and exits 0", () => {
  const pkg = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8"));
  const res = spawnSync(process.execPath, [binPath, "--version"], { encoding: "utf8" });

  assert.equal(res.status, 0);
  assert.equal(res.stdout.trim(), pkg.version);
  assert.equal(res.stderr, "");
});
