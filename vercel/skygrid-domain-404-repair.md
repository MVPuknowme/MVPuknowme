# SKYGRID Vercel Domain 404 Repair — Deprecated Target Note

## Current status

This note is retained as historical evidence of a prior `404` failure pattern.

Do **not** use `https://aura-core-t2t5.vercel.app` as the canonical target. Later verification showed that `aura-core-t2t5` returned route `404` for required SKYGRID endpoints.

Use the healthy public Vercel alias instead:

```text
https://aura-core.vercel.app
```

Canonical domain still intended:

```text
https://skygrid-protocol.net
```

## Original failure pattern

The canonical domain `https://skygrid-protocol.net` resolved and responded quickly, but required SkyGrid public routes returned HTTP `404`.

Observed walk test:

```text
/                              404
/health.json                   404
/highway                       404
/api/highway/status            404
/api/highway/flasks            404
/api/highway/postman           404
/dispatch                      404
/scenarios                     404
/rates                         404
/base                          404
/pay                           404
/api/pay/quote?amount=25       404
/api/stripe/device-link        404
```

## Diagnosis

DNS/TLS was working and Vercel edge was reachable. The failure was not a DNS failure.

Likely causes were:

```yaml
root_cause:
  - skygrid-protocol.net attached to the wrong Vercel project
  - production alias pointed to a deployment with no SkyGrid runtime output
  - runtime project missing Vercel rewrites/API handler wiring
```

## Required product language

Do not rename this as a generic serverless project.

The public runtime belongs to:

```text
SKYGRID Emergency Data On-Ramp
```

Vercel's role is:

```text
public runtime/front door for controlled-pilot status, proof, quote, and demo routes
```

## Correct target now

Attach the canonical domain to the Vercel project that serves:

```text
https://aura-core.vercel.app
```

Do not attach the canonical domain to:

```text
https://aura-core-t2t5.vercel.app
```

unless that target is revalidated and all required routes pass.

## Vercel dashboard repair steps

1. Open Vercel dashboard.
2. Open the project that owns `aura-core.vercel.app`.
3. Go to **Settings → Domains**.
4. Add:

```text
skygrid-protocol.net
www.skygrid-protocol.net
```

5. If Vercel says the domain is already assigned elsewhere, remove it from the wrong project and re-add it to the project that owns `aura-core.vercel.app`.
6. Confirm production deployment is assigned to the domain.
7. Redeploy if needed.

## DNS records

At the DNS provider, use the exact records Vercel shows. Common Vercel values are:

```text
A      @      76.76.21.21
CNAME  www    cname.vercel-dns.com
```

Use the exact project-specific value Vercel shows if Vercel provides one.

## Verification commands

First verify the public Vercel alias:

```bash
TEST="https://aura-core.vercel.app"

for path in "/" "/health.json" "/api/highway/status" "/api/highway/postman" "/api/pay/quote?amount=25"; do
  echo "== $TEST$path =="
  curl -sS -o /dev/null -w "HTTP %{http_code} | %{time_total}s\n" "$TEST$path"
done
```

Then test canonical domain after attachment:

```bash
BASE="https://skygrid-protocol.net"

for path in "/" "/health.json" "/api/highway/status" "/api/highway/postman" "/api/pay/quote?amount=25"; do
  echo "== $BASE$path =="
  curl -sS -o /dev/null -w "HTTP %{http_code} | %{time_total}s\n" "$BASE$path"
done
```

## Pass condition

```text
/                         200 or redirect to valid landing
/health.json              200 JSON pulse
/api/highway/status       200 JSON route map
/api/highway/postman      200 JSON-compatible proof route
/api/pay/quote?amount=25  200 JSON quote-only response
```

## Safety guardrails

The public runtime must remain controlled-pilot/advisory only.

Do not enable from public routes:

- production traffic cutover
- payment execution
- private data transfer
- device activation
- unsupported emergency-service claims

## Prompt for Vercel/Q/Codex

```text
You are repairing the SKYGRID Emergency Data On-Ramp public runtime.

Do not use stale aura-core-t2t5 route targets. The healthy public target is https://aura-core.vercel.app.

Attach skygrid-protocol.net to the same Vercel project/deployment that serves aura-core.vercel.app, then verify:
/
/health.json
/api/highway/status
/api/highway/postman
/api/pay/quote?amount=25

Expected behavior:
- / returns SkyGrid landing/runtime page
- /health.json returns JSON health/pulse
- /api/highway/status returns JSON route map
- /api/highway/postman returns JSON proof metadata or JSON-compatible response
- /api/pay/quote?amount=25 returns quote-only JSON

Do not execute payments, activate devices, or perform production failover from public routes.
```
