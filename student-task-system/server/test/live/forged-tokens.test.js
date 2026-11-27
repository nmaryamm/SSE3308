// LIVE test against your REAL Firebase project's token verification.
// The emulator does not check token signatures, so forged-signature tests only mean something here.
// Reads server/.env; makes NO changes to your project (only Google's public signing keys are downloaded).
import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import { generateKeyPairSync, createSign, createHmac } from "node:crypto";
import { existsSync } from "node:fs";
import { once } from "node:events";

const envFile = new URL("../../.env", import.meta.url);
const skip = process.env.FIRESTORE_EMULATOR_HOST || process.env.FIREBASE_AUTH_EMULATOR_HOST
  ? "emulator variables are set; run `npm run test:live` in a normal terminal"
  : !existsSync(envFile) ? "server/.env not found" : false;

const b64url = value => Buffer.from(typeof value === "string" ? value : JSON.stringify(value)).toString("base64url");

describe("Forged tokens against the real Firebase project", { skip }, () => {
  let server, base, projectId, realKid;

  const claims = (overrides = {}) => {
    const now = Math.floor(Date.now() / 1000);
    return {
      iss: `https://securetoken.google.com/${projectId}`, aud: projectId,
      auth_time: now - 10, iat: now - 10, exp: now + 3600,
      sub: "forged-uid", user_id: "forged-uid", ...overrides
    };
  };
  const rs256 = (header, payload, privateKey) => {
    const data = `${b64url(header)}.${b64url(payload)}`;
    return `${data}.${createSign("RSA-SHA256").update(data).sign(privateKey).toString("base64url")}`;
  };
  const request = token => fetch(`${base}/api/tasks`, { headers: { Authorization: `Bearer ${token}` } });

  before(async () => {
    process.loadEnvFile(envFile);
    process.env.RATE_LIMIT_MAX = "10000";
    projectId = process.env.FIREBASE_PROJECT_ID;
    const keys = await (await fetch("https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com")).json();
    realKid = Object.keys(keys)[0];
    const { createApp } = await import("../../src/app.js");
    server = createApp().listen(0, "127.0.0.1");
    await once(server, "listening");
    base = `http://127.0.0.1:${server.address().port}`;
  });
  after(() => new Promise(resolve => server.close(resolve)));

  it("unsigned token (alg: none) -> 401", async () => {
    assert.equal((await request(`${b64url({ alg: "none", typ: "JWT" })}.${b64url(claims())}.`)).status, 401);
  });

  it("token signed with an attacker's own RSA key, using Google's real key ID -> 401", async () => {
    const { privateKey } = generateKeyPairSync("rsa", { modulusLength: 2048 });
    assert.equal((await request(rs256({ alg: "RS256", kid: realKid, typ: "JWT" }, claims(), privateKey))).status, 401);
  });

  it("token signed with HS256 and a guessed secret (algorithm confusion) -> 401", async () => {
    const data = `${b64url({ alg: "HS256", kid: realKid, typ: "JWT" })}.${b64url(claims())}`;
    const signature = createHmac("sha256", "secret").update(data).digest("base64url");
    assert.equal((await request(`${data}.${signature}`)).status, 401);
  });

  it("emulator-style token used against the real project -> 401", async () => {
    assert.equal((await request(`${b64url({ alg: "none", typ: "JWT" })}.${b64url(claims({ firebase: { sign_in_provider: "password" } }))}.`)).status, 401);
  });

  it("expired forged token -> 401", async () => {
    const { privateKey } = generateKeyPairSync("rsa", { modulusLength: 2048 });
    const past = Math.floor(Date.now() / 1000) - 7200;
    assert.equal((await request(rs256({ alg: "RS256", kid: realKid }, claims({ iat: past, auth_time: past, exp: past + 3600 }), privateKey))).status, 401);
  });
});
