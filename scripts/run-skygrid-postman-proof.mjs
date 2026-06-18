#!/usr/bin/env node

import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';

const collection = 'postman/skygrid-runtime-proof-lane.postman_collection.json';
const environment = 'postman/skygrid-public.environment.json';
const canonicalBase = process.env.SKYGRID_PROOF_BASE_URL || 'https://aurcore.skygrid-protocol.net';
const fallbackBase = process.env.SKYGRID_FALLBACK_PROOF_URL || 'https://aura-core.vercel.app';
const useFallback = process.argv.includes('--fallback');
const baseUrl = useFallback ? fallbackBase : canonicalBase;

if (!existsSync(collection)) {
  console.error(`Missing Postman collection: ${collection}`);
  process.exit(1);
}

if (!existsSync(environment)) {
  console.error(`Missing Postman environment: ${environment}`);
  process.exit(1);
}

const args = [
  'newman',
  'run',
  collection,
  '--environment',
  environment,
  '--env-var',
  `skygrid_base=${baseUrl}`,
  '--env-var',
  `canonical_base=${canonicalBase}`,
  '--env-var',
  `fallback_base=${fallbackBase}`,
  '--env-var',
  `web3_ref_base=${baseUrl}`,
  '--env-var',
  `flaky_base=${baseUrl}`,
  '--env-var',
  'auth_mode=none-for-public-routes',
  '--timeout-request',
  process.env.SKYGRID_PROOF_TIMEOUT_MS || '15000',
  '--bail',
  'failure'
];

console.log(`SKYGRID Postman proof lane target: ${baseUrl}`);
console.log(useFallback ? 'Mode: fallback proof target' : 'Mode: canonical domain target');

const child = spawn('npx', args, {
  stdio: 'inherit',
  shell: process.platform === 'win32'
});

child.on('exit', (code, signal) => {
  if (signal) {
    console.error(`Newman terminated by signal ${signal}`);
    process.exit(1);
  }
  process.exit(code ?? 1);
});
