# SkyGrid Vercel Domain 404 Repair

## Situation

The canonical domain `https://skygrid-protocol.net` resolves and responds quickly, but every required SkyGrid public route returns HTTP 404.

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

DNS/TLS is working and Vercel edge is reachable. The failure is not a DNS failure.

Likely cause:

```yaml
root_cause:
  - skygrid-protocol.net is attached to the wrong Vercel project
  - or production alias points to a deployment with no SkyGrid runtime output
  - or the runtime project is missing Vercel rewrites/API handler wiring
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

## Correct target

Attach the domain to the Vercel project that owns the working deployment:

```text
https://aura-core-t2t5.vercel.app/
```

Canonical domain:

```text
https://skygrid-protocol.net
```

## Vercel dashboard repair steps

1. Open Vercel dashboard.
2. Open the project that owns `aura-core-t2t5.vercel.app`.
3. Go to **Settings → Domains**.
4. Add:

```text
skygrid-protocol.net
www.skygrid-protocol.net
```

5. If Vercel says the domain is already assigned elsewhere, remove it from the wrong project and re-add it to the project that owns `aura-core-t2t5.vercel.app`.
6. Confirm production deployment is assigned to the domain.
7. Redeploy if needed.

## DNS records

At the DNS provider:

```text
A      @      76.76.21.21
CNAME  www    cname.vercel-dns.com
```

Use the exact project-specific value Vercel shows if Vercel provides one.

## Runtime route repair if domain is attached correctly but routes still 404

Create or confirm:

```text
api/runtime.mjs
```

With:

```js
export { default } from '../app.js';
```

Then confirm `vercel.json` contains rewrites:

```json
{
  "version": 2,
  "rewrites": [
    { "source": "/", "destination": "/api/runtime" },
    { "source": "/health.json", "destination": "/api/runtime" },
    { "source": "/highway", "destination": "/api/runtime" },
    { "source": "/api/highway/status", "destination": "/api/runtime" },
    { "source": "/api/highway/flasks", "destination": "/api/runtime" },
    { "source": "/api/highway/postman", "destination": "/api/runtime" },
    { "source": "/dispatch", "destination": "/api/runtime" },
    { "source": "/scenarios", "destination": "/api/runtime" },
    { "source": "/rates", "destination": "/api/runtime" },
    { "source": "/base", "destination": "/api/runtime" },
    { "source": "/pay", "destination": "/api/runtime" },
    { "source": "/api/pay/quote", "destination": "/api/runtime" },
    { "source": "/api/stripe/device-link", "destination": "/api/runtime" }
  ]
}
```

## Verification commands

First compare the Vercel deployment URL:

```bash
TEST="https://aura-core-t2t5.vercel.app"

for path in "/" "/health.json" "/highway" "/api/highway/status" "/dispatch" "/api/pay/quote?amount=25"; do
  echo "== $TEST$path =="
  curl -sS -o /dev/null -w "HTTP %{http_code} | %{time_total}s\n" "$TEST$path"
done
```

Then test canonical domain:

```bash
BASE="https://skygrid-protocol.net"

for path in "/" "/health.json" "/highway" "/api/highway/status" "/api/pay/quote?amount=25"; do
  echo "== $BASE$path =="
  curl -sS -o /dev/null -w "HTTP %{http_code} | %{time_total}s\n" "$BASE$path"
done
```

## Pass condition

```text
/                         200 or redirect to valid landing
/health.json              200 JSON pulse
/highway                  200 showcase page
/api/highway/status       200 JSON route map
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
The domain skygrid-protocol.net resolves and reaches Vercel, but all required SkyGrid routes return HTTP 404. This means DNS/TLS is working, but the domain is attached to the wrong Vercel project, production alias, or route output.

Fix this as the SKYGRID Emergency Data On-Ramp public runtime, not a generic serverless app.

Attach skygrid-protocol.net to the same Vercel project/deployment as aura-core-t2t5.vercel.app, or repair the production deployment with api/runtime.mjs and vercel.json rewrites.

Required routes:
/
/health.json
/highway
/api/highway/status
/api/highway/flasks
/api/highway/postman
/dispatch
/scenarios
/rates
/base
/pay
/api/pay/quote?amount=25
/api/stripe/device-link

Expected behavior:
- / returns SkyGrid landing/runtime page
- /health.json returns JSON health/pulse
- /highway returns Highway API showcase
- /api/highway/status returns JSON route map
- /api/pay/quote?amount=25 returns quote-only JSON
- /api/stripe/device-link returns safe staged/advisory status

Do not execute payments, activate devices, or perform production failover from public routes.
```
