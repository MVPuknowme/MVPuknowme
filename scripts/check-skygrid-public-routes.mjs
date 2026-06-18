#!/usr/bin/env node

const CANONICAL_BASE_URL = 'https://aurcore.skygrid-protocol.net';
const FALLBACK_BASE_URL = 'https://aura-core.vercel.app';

const DEFAULT_BASE_URLS = [
  CANONICAL_BASE_URL,
  FALLBACK_BASE_URL
];

const REQUIRED_ROUTES = [
  { path: '/', type: 'html', expected: [200] },
  { path: '/health.json', type: 'json', expected: [200] },
  { path: '/api/highway/status', type: 'json', expected: [200] },
  { path: '/api/highway/postman', type: 'json-compatible', expected: [200] },
  { path: '/api/pay/quote?amount=25', type: 'json', expected: [200] }
];

const baseUrls = (process.env.SKYGRID_ROUTE_CHECK_BASE_URLS || '')
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean);

const targets = baseUrls.length > 0 ? baseUrls : DEFAULT_BASE_URLS;
const timeoutMs = Number.parseInt(process.env.SKYGRID_ROUTE_CHECK_TIMEOUT_MS || '15000', 10);
const requireAllTargets = String(process.env.SKYGRID_ROUTE_CHECK_REQUIRE_ALL || '').toLowerCase() === 'true';
const requireCanonical = String(process.env.SKYGRID_REQUIRE_CANONICAL_DOMAIN || '').toLowerCase() === 'true';
const targetResults = new Map();

function buildUrl(baseUrl, routePath) {
  return new URL(routePath, baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`).toString();
}

async function fetchWithTimeout(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'user-agent': 'skygrid-route-check/1.1',
        accept: 'application/json,text/html;q=0.9,*/*;q=0.8'
      }
    });
  } finally {
    clearTimeout(timer);
  }
}

function looksLikeJson(text) {
  const trimmed = text.trim();
  return trimmed.startsWith('{') || trimmed.startsWith('[');
}

function validatePayload(route, text, contentType) {
  if (route.type === 'json') {
    if (!contentType.includes('application/json')) {
      return `expected JSON content-type, received ${contentType || 'missing content-type'}`;
    }

    try {
      JSON.parse(text);
    } catch (error) {
      return `invalid JSON body: ${error instanceof Error ? error.message : String(error)}`;
    }
  }

  if (route.type === 'json-compatible') {
    if (!contentType.includes('application/json') && !looksLikeJson(text)) {
      return `expected JSON-compatible body, received ${contentType || 'missing content-type'}`;
    }

    try {
      JSON.parse(text);
    } catch (error) {
      return `invalid JSON-compatible body: ${error instanceof Error ? error.message : String(error)}`;
    }
  }

  if (route.type === 'html') {
    if (!text.toLowerCase().includes('<!doctype html') && !text.toLowerCase().includes('<html')) {
      return 'expected HTML body marker';
    }
  }

  return null;
}

for (const baseUrl of targets) {
  console.log(`\n== SKYGRID public route check: ${baseUrl} ==`);
  const failures = [];

  for (const route of REQUIRED_ROUTES) {
    const url = buildUrl(baseUrl, route.path);
    const startedAt = Date.now();

    try {
      const response = await fetchWithTimeout(url);
      const elapsedMs = Date.now() - startedAt;
      const text = await response.text();
      const contentType = response.headers.get('content-type') || '';
      const statusOk = route.expected.includes(response.status);
      const payloadError = statusOk ? validatePayload(route, text, contentType) : null;
      const line = `${response.status} ${route.path} ${elapsedMs}ms ${contentType}`;

      console.log(statusOk && !payloadError ? `PASS ${line}` : `FAIL ${line}`);

      if (!statusOk) {
        failures.push({ baseUrl, route: route.path, error: `expected ${route.expected.join('/')} received ${response.status}` });
      } else if (payloadError) {
        failures.push({ baseUrl, route: route.path, error: payloadError });
      }
    } catch (error) {
      const elapsedMs = Date.now() - startedAt;
      const message = error instanceof Error ? error.message : String(error);
      console.log(`FAIL ERR ${route.path} ${elapsedMs}ms ${message}`);
      failures.push({ baseUrl, route: route.path, error: message });
    }
  }

  targetResults.set(baseUrl, {
    ok: failures.length === 0,
    failures
  });
}

const passingTargets = [...targetResults.entries()].filter(([, result]) => result.ok);
const canonicalResult = targetResults.get(CANONICAL_BASE_URL);
const fallbackResult = targetResults.get(FALLBACK_BASE_URL);
const hardFailures = [];

if (requireAllTargets) {
  for (const [baseUrl, result] of targetResults.entries()) {
    if (!result.ok) hardFailures.push(...result.failures);
  }
} else if (passingTargets.length === 0) {
  for (const result of targetResults.values()) hardFailures.push(...result.failures);
}

if (requireCanonical && canonicalResult && !canonicalResult.ok) {
  hardFailures.push(...canonicalResult.failures);
}

if (canonicalResult && !canonicalResult.ok && fallbackResult?.ok && !requireCanonical && !requireAllTargets) {
  console.warn('\nSKYGRID canonical domain warning:');
  console.warn(`- ${CANONICAL_BASE_URL} is not serving required routes yet.`);
  console.warn(`- ${FALLBACK_BASE_URL} passed all required routes, so CI remains green during domain cutover.`);
  console.warn('- Attach aurcore.skygrid-protocol.net to the healthy Vercel aura-core project, then set SKYGRID_REQUIRE_CANONICAL_DOMAIN=true.');
}

if (hardFailures.length > 0) {
  console.error('\nSKYGRID public route check failed:');
  for (const failure of hardFailures) {
    console.error(`- ${failure.baseUrl}${failure.route}: ${failure.error}`);
  }
  process.exit(1);
}

console.log('\nSKYGRID public route check passed.');
