#!/usr/bin/env node
/**
 * One-time setup: create D1 database, update wrangler.toml, apply migration.
 * Run: CLOUDFLARE_API_TOKEN=xxx CLOUDFLARE_ACCOUNT_ID=yyy node scripts/setup-d1.mjs
 * (Or use the same values you have in GitHub Secrets.)
 */

import { spawn } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const token = process.env.CLOUDFLARE_API_TOKEN;
const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;

if (!token || !accountId) {
  console.error(`
  Necesitas definir CLOUDFLARE_API_TOKEN y CLOUDFLARE_ACCOUNT_ID.

  Ejemplo (en la terminal):
    export CLOUDFLARE_API_TOKEN=tu_token
    export CLOUDFLARE_ACCOUNT_ID=tu_account_id
    node scripts/setup-d1.mjs

  El token lo creas en: https://dash.cloudflare.com/profile/api-tokens
  (plantilla "Edit Cloudflare Workers").
  El Account ID está en: Workers & Pages → barra lateral derecha.
`);
  process.exit(1);
}

function run(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, {
      cwd: root,
      stdio: ["ignore", "pipe", "pipe"],
      env: { ...process.env, CLOUDFLARE_API_TOKEN: token, CLOUDFLARE_ACCOUNT_ID: accountId },
      ...opts,
    });
    let out = "";
    let err = "";
    p.stdout?.on("data", (d) => { out += d; });
    p.stderr?.on("data", (d) => { err += d; });
    p.on("close", (code) => {
      if (code === 0) resolve({ out, err });
      else reject(new Error(err || out || `exit ${code}`));
    });
  });
}

async function main() {
  console.log("1. Creando base D1 'teamfly-db'...");
  let data;
  try {
    const res = await run("npx", ["wrangler", "d1", "create", "teamfly-db"]);
    const out = res.out + res.err;
    const jsonMatch = out.match(/\{[\s\S]*"d1_databases"[\s\S]*?\}/);
    if (!jsonMatch) {
      console.error("No se pudo obtener el database_id. Salida:", out.slice(0, 500));
      process.exit(1);
    }
    data = JSON.parse(jsonMatch[0]);
  } catch (e) {
    if (e.message.includes("already exists") || e.message.includes("Already exists")) {
      console.log("   La base 'teamfly-db' ya existe. Obteniendo ID...");
      const list = await run("npx", ["wrangler", "d1", "list", "--json"]);
      const listData = JSON.parse(list.out.trim());
      const arr = Array.isArray(listData) ? listData : listData.result ?? listData.databases ?? [];
      const existing = arr.find((d) => (d.name || d.database_name) === "teamfly-db");
      const databaseId = existing?.uuid ?? existing?.database_id ?? existing?.id;
      if (databaseId) {
        data = { d1_databases: [{ database_name: "teamfly-db", database_id: databaseId }] };
      } else {
        console.error("No se encontró teamfly-db en wrangler d1 list.");
        process.exit(1);
      }
    } else {
      throw e;
    }
  }

  const db = data.d1_databases?.find((d) => d.database_name === "teamfly-db") ?? data.d1_databases?.[0];
  if (!db?.database_id) {
    console.error("No se encontró database_id en la salida.");
    process.exit(1);
  }
  const databaseId = db.database_id;
  console.log("   database_id:", databaseId);

  console.log("2. Actualizando wrangler.toml...");
  const wranglerPath = join(root, "wrangler.toml");
  let wranglerContent = readFileSync(wranglerPath, "utf8");
  if (wranglerContent.includes("YOUR_D1_DATABASE_ID")) {
    wranglerContent = wranglerContent.replace(/YOUR_D1_DATABASE_ID/g, databaseId);
    writeFileSync(wranglerPath, wranglerContent);
  } else {
    console.log("   (database_id ya estaba configurado)");
  }

  console.log("3. Aplicando migración a D1 (remoto)...");
  await run("npx", [
    "wrangler", "d1", "execute", "teamfly-db",
    "--remote",
    "--file=./prisma/migrations/0001_init.sql",
  ]);

  console.log("\n✅ Listo. En Pages dashboard añade el binding D1 (mismo database_id). Luego:");
  console.log("   git add . && git commit -m 'Configure D1' && git push");
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
