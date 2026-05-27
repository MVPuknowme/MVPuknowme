# SkyGrid Preflight Launch Checklist

## Launch objective

Ship SkyGrid Emergency-Ready Infrastructure Preflight as a controlled pilot service now.

## Active service

SkyGrid helps teams verify infrastructure readiness, route health, and fallback posture before outages or congestion become business problems.

## Launch lane

```yaml
status: launch_in_progress
mode: controlled_pilot
sentinel: fail_closed
public_language: advisory
proof_required: yes
```

## Step 1 — Stable runtime URL

- [ ] Open Vercel successful deployment.
- [ ] Copy stable public production URL.
- [ ] Record it below:

```text
SKYGRID_BASE_URL=
```

## Step 2 — B12 dashboard widget

- [ ] Open B12 editor.
- [ ] Go to SkyGrid intake section.
- [ ] Add Integration / HTML block.
- [ ] Paste `dashboard/b12-skygrid-runway-widget.html`.
- [ ] Replace `__SKYGRID_BASE_URL__` with the stable Vercel URL.
- [ ] Publish staging.

## Step 3 — Button check

Confirm these B12 paths open correctly:

```text
Pulse                 -> /health.json
Project Runway        -> /highway
Highway JSON          -> /api/highway/status
Dispatcher            -> /dispatch
Scenarios             -> /scenarios
Rates                 -> /rates
Sun-Pay               -> /pay
Quote safely          -> /api/pay/quote?amount=25
Check device-link     -> /api/stripe/device-link
```

## Step 4 — Postman proof lane

- [ ] Import `postman/skygrid-runway-validation.postman_collection.json`.
- [ ] Set `baseUrl` to the stable Vercel URL.
- [ ] Run the collection.
- [ ] Save screenshot or exported results.
- [ ] Attach result to proof packet.

## Step 5 — Offer link

Use the B12 SkyGrid intake link as the public pilot offer page.

Current staging target:

```text
https://aura-sky-skygrid-protocol-staging.b12sites.com/#skygrid-intake
```

## Partner message

SkyGrid is ready for a controlled infrastructure preflight pilot.

The service checks runtime health, route readiness, fallback posture, Base/Web3 quote posture, and proof validation through a public-safe dashboard. It is advisory, consent-first, and fail-closed: no live cutover, no payment execution, and no device activation without approval.

What we can deliver immediately:

1. A public preflight dashboard.
2. A proof packet using Postman route validation.
3. A partner review workflow for infrastructure readiness.

The goal is simple: show whether the network is ready before stress, congestion, or outage conditions force a reaction.

## Guardrails

- No guaranteed uptime claims.
- No guaranteed revenue claims.
- No live payment execution from public routes.
- No device activation without explicit consent.
- No automatic traffic cutover.
- Sentinel remains fail-closed.

## Completion definition

The service is launchable when:

- B12 widget is live.
- Stable Vercel URL is wired.
- Pulse route loads.
- Postman validation passes or known staged failures are documented.
- First partner message is sent.
