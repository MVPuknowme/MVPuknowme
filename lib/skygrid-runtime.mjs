const SERVICE_NAME = 'SKYGRID Emergency Data On-Ramp';
const NETWORK_NAME = 'Aura-Core';
const MODE = 'controlled-pilot';
const CANONICAL_APP_DOMAIN = 'https://aurcore.skygrid-protocol.net';
const FALLBACK_PROOF_DOMAIN = 'https://aura-core.vercel.app';

export const REQUIRED_PUBLIC_ROUTES = [
  '/',
  '/health.json',
  '/api/health',
  '/api/status',
  '/api/intake',
  '/api/pacific-heart/ingest',
  '/api/skygrid/helm',
  '/api/skygrid/provenance',
  '/api/skygrid/aws',
  '/dispatch',
  '/scenarios',
  '/rates',
  '/base',
  '/pay',
  '/highway',
  '/interface',
  '/api/pay/quote',
  '/api/highway/status',
  '/api/highway/flasks',
  '/api/highway/postman',
  '/api/stripe/device-link'
];

const GUARDRAILS = [
  'controlled-pilot/advisory output only',
  'no public production traffic cutover',
  'no public payment execution',
  'no public private-data transfer',
  'no public device activation',
  'no unsupported emergency-service claims'
];

function nowIso() {
  return new Date().toISOString();
}

function baseHeaders(contentType) {
  return {
    'content-type': contentType,
    'cache-control': 'no-store',
    'x-skygrid-network': NETWORK_NAME,
    'x-skygrid-service': SERVICE_NAME,
    'x-skygrid-mode': MODE,
    'x-skygrid-canonical-domain': CANONICAL_APP_DOMAIN,
    'x-skygrid-fallback-domain': FALLBACK_PROOF_DOMAIN
  };
}

function baseMetadata() {
  return {
    service: SERVICE_NAME,
    network: NETWORK_NAME,
    mode: MODE,
    canonical_domain: CANONICAL_APP_DOMAIN,
    fallback_proof_domain: FALLBACK_PROOF_DOMAIN
  };
}

function json(body, statusCode = 200) {
  return {
    statusCode,
    headers: baseHeaders('application/json; charset=utf-8'),
    body: JSON.stringify(body, null, 2)
  };
}

function html(title, lead, sections = []) {
  const sectionHtml = sections
    .map((section) => `<section><h2>${escapeHtml(section.heading)}</h2><p>${escapeHtml(section.copy)}</p></section>`)
    .join('\n');

  return {
    statusCode: 200,
    headers: baseHeaders('text/html; charset=utf-8'),
    body: `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)} | ${SERVICE_NAME}</title>
  <style>
    :root { color-scheme: dark; --bg: #0b1020; --panel: #151b35; --text: #f8fbff; --muted: #b8c4d9; --accent: #7dd3fc; --warn: #fbbf24; }
    body { margin: 0; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: radial-gradient(circle at top, #1a1f3b, var(--bg)); color: var(--text); }
    main { max-width: 980px; margin: 0 auto; padding: 56px 22px; }
    .card { background: rgba(21,27,53,.88); border: 1px solid rgba(125,211,252,.22); border-radius: 24px; padding: 28px; box-shadow: 0 24px 80px rgba(0,0,0,.32); }
    h1 { margin: 0 0 12px; font-size: clamp(2rem, 6vw, 4.8rem); line-height: .95; letter-spacing: -.05em; }
    h2 { margin: 24px 0 8px; color: var(--accent); }
    p { color: var(--muted); font-size: 1.05rem; line-height: 1.65; }
    code, .pill { color: var(--text); background: rgba(125,211,252,.12); border: 1px solid rgba(125,211,252,.28); border-radius: 999px; padding: 6px 10px; }
    ul { color: var(--muted); line-height: 1.7; }
    a { color: var(--accent); }
    .warning { color: var(--warn); }
  </style>
</head>
<body>
  <main>
    <div class="card">
      <p class="pill">${SERVICE_NAME} · ${MODE}</p>
      <h1>${escapeHtml(title)}</h1>
      <p>${escapeHtml(lead)}</p>
      ${sectionHtml}
      <section>
        <h2>Canonical domain</h2>
        <p><a href="${CANONICAL_APP_DOMAIN}">${CANONICAL_APP_DOMAIN}</a></p>
      </section>
      <section>
        <h2>Public guardrails</h2>
        <ul>${GUARDRAILS.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
      </section>
      <p class="warning">Runtime pulse: ${nowIso()}</p>
    </div>
  </main>
</body>
</html>`
  };
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function parsePath(inputUrl = '/') {
  const parsed = new URL(inputUrl, CANONICAL_APP_DOMAIN);
  const rewrittenPath = parsed.searchParams.get('__path');

  if (rewrittenPath) {
    const rewritten = new URL(rewrittenPath, CANONICAL_APP_DOMAIN);
    for (const [key, value] of rewritten.searchParams.entries()) {
      if (!parsed.searchParams.has(key)) parsed.searchParams.set(key, value);
    }
    return { pathname: rewritten.pathname, searchParams: parsed.searchParams };
  }

  return { pathname: parsed.pathname, searchParams: parsed.searchParams };
}

function quotePayload(searchParams) {
  const rawAmount = searchParams.get('amount') ?? '25';
  const amount = Number.parseFloat(rawAmount);
  const safeAmount = Number.isFinite(amount) && amount > 0 ? amount : 25;
  const systemFeeRate = 0.035;
  const systemFee = Number((safeAmount * systemFeeRate).toFixed(2));

  return {
    ok: true,
    ...baseMetadata(),
    quote_only: true,
    amount_usd: Number(safeAmount.toFixed(2)),
    estimated_system_fee_rate: systemFeeRate,
    estimated_system_fee_usd: systemFee,
    execution: 'disabled on public route',
    payment_activation: 'not performed',
    timestamp: nowIso()
  };
}

export async function routeSkygridRequest({ method = 'GET', url = '/', headers = {} } = {}) {
  const upperMethod = String(method || 'GET').toUpperCase();
  const { pathname, searchParams } = parsePath(url);

  if (pathname === '/' || pathname === '/interface') {
    return html(
      'SKYGRID Control Runtime',
      'A public controlled-pilot front door for health, proof, quote, route-map, and emergency continuity demo surfaces.',
      [
        { heading: 'Status', copy: 'The runtime is serving route output and preserving advisory-only guardrails.' },
        { heading: 'App/interface domain', copy: `All apps and interfaces route through ${CANONICAL_APP_DOMAIN}. ${FALLBACK_PROOF_DOMAIN} is retained only as deployment proof/fallback.` },
        { heading: 'Next verification', copy: 'Check /health.json, /api/highway/status, /api/pay/quote?amount=25, and /api/stripe/device-link.' }
      ]
    );
  }

  if (pathname === '/health.json' || pathname === '/api/health' || pathname === '/api/status') {
    return json({
      ok: true,
      ...baseMetadata(),
      runtime: 'vercel-node-esm',
      timestamp: nowIso(),
      required_public_routes: REQUIRED_PUBLIC_ROUTES,
      guardrails: GUARDRAILS
    });
  }

  if (pathname === '/highway') {
    return html(
      'Highway Route Map',
      'A controlled-pilot showcase for SKYGRID route visibility across status, postman proof, flasks, and quote-only endpoints.',
      [
        { heading: 'Available JSON', copy: '/api/highway/status returns route status, /api/highway/postman returns proof metadata, and /api/highway/flasks returns staged flask surfaces.' }
      ]
    );
  }

  if (pathname === '/dispatch' || pathname === '/scenarios') {
    return html(
      pathname === '/dispatch' ? 'Dispatch Advisory Surface' : 'Scenario Drill Surface',
      'This page is staged for emergency, outage, responder, system-health, and continuity workflows without activating live dispatch.',
      [
        { heading: 'Pilot posture', copy: 'Public route confirms availability only. Actual partner routing must stay authenticated and auditable.' }
      ]
    );
  }

  if (pathname === '/rates' || pathname === '/base') {
    return html(
      pathname === '/rates' ? 'Base Rate Utilization Bands' : 'Base Network Readiness',
      'Quote and utilization surfaces are staged for transparent demonstrations without executing payments or settlement.',
      [
        { heading: 'Financial guardrail', copy: 'The public route may display estimates only. Execution remains disabled.' }
      ]
    );
  }

  if (pathname === '/pay') {
    return html(
      'Quote-Only Payment Readiness',
      'Payment execution is disabled here. Use /api/pay/quote?amount=25 for a safe quote-only JSON response.',
      [
        { heading: 'No charge path', copy: 'This public page does not create sessions, charge cards, move funds, or activate devices.' }
      ]
    );
  }

  if (pathname === '/api/pay/quote') {
    return json(quotePayload(searchParams));
  }

  if (pathname === '/api/highway/status') {
    return json({
      ok: true,
      ...baseMetadata(),
      status: 'route-map-online',
      routes: REQUIRED_PUBLIC_ROUTES.map((route) => ({ route, state: 'served-or-staged' })),
      timestamp: nowIso()
    });
  }

  if (pathname === '/api/highway/flasks') {
    return json({
      ok: true,
      ...baseMetadata(),
      flasks: [
        { name: 'status', state: 'served' },
        { name: 'postman', state: 'served' },
        { name: 'quote', state: 'quote-only' },
        { name: 'dispatch', state: 'staged-advisory' }
      ],
      timestamp: nowIso()
    });
  }

  if (pathname === '/api/highway/postman') {
    return json({
      ok: true,
      ...baseMetadata(),
      proof: 'public-runtime-route-check',
      postman_collection: 'skygrid-reliability.collection.json',
      expected_assertions: ['HTTP 200 on public demo routes', 'JSON on status and quote routes', 'no execution on unsafe routes'],
      timestamp: nowIso()
    });
  }

  if (pathname === '/api/skygrid/helm') {
    return json({
      ok: true,
      ...baseMetadata(),
      helm: 'public-runtime-control-surface',
      authority: 'advisory-only',
      timestamp: nowIso()
    });
  }

  if (pathname === '/api/skygrid/provenance') {
    return json({
      ok: true,
      ...baseMetadata(),
      provenance: {
        product_language: SERVICE_NAME,
        network: NETWORK_NAME,
        public_runtime_role: 'front door for controlled-pilot status, proof, quote, and demo routes'
      },
      timestamp: nowIso()
    });
  }

  if (pathname === '/api/skygrid/aws') {
    return json({
      ok: true,
      ...baseMetadata(),
      aws_role: 'authenticated emergency data validation, logging, routing, and partner dashboard integration',
      public_route_role: 'status and readiness signal only',
      timestamp: nowIso()
    });
  }

  if (pathname === '/api/stripe/device-link') {
    return json({
      ok: true,
      ...baseMetadata(),
      staged: true,
      device_activation: 'disabled on public route',
      stripe_execution: 'disabled on public route',
      next_required_step: 'authenticated partner workflow before any activation or payment execution',
      timestamp: nowIso()
    });
  }

  if (pathname === '/api/intake' || pathname === '/api/pacific-heart/ingest') {
    return json({
      ok: true,
      ...baseMetadata(),
      intake_state: upperMethod === 'POST' ? 'received-as-demo-envelope' : 'ready-for-demo-envelope',
      persistence: 'disabled on public route',
      routing: 'disabled on public route',
      timestamp: nowIso()
    }, upperMethod === 'POST' ? 202 : 200);
  }

  return json({
    ok: false,
    ...baseMetadata(),
    error: 'route_not_found',
    path: pathname,
    available_routes: REQUIRED_PUBLIC_ROUTES,
    timestamp: nowIso()
  }, 404);
}

export async function handleVercelRequest(req, res) {
  const response = await routeSkygridRequest({
    method: req.method,
    url: req.url,
    headers: req.headers || {}
  });

  res.statusCode = response.statusCode;
  for (const [key, value] of Object.entries(response.headers)) {
    res.setHeader(key, value);
  }
  res.end(response.body);
}
