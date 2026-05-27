# SkyGrid Runway Operator Runbook

## Mission

Showcase SkyGrid / Aura-Core as a polished, public-safe, human-guided runtime dashboard.

This runbook supports the B12 staging page, the SkyGrid runtime, Postman validation, and MVP-led human interaction training.

## Posture

```yaml
status: runway_ready
mode: advisory_preflight
sentinel: fail_closed
human_interaction: guided_by_MVP
public_language: proof_first_no_overclaiming
blocked_from_public_widget:
  - live_cutover
  - payment_execution
  - private_data_transfer
  - device_activation_without_consent
```

## Files added

```text
dashboard/b12-skygrid-runway-widget.html
postman/skygrid-runway-validation.postman_collection.json
docs/skygrid-runway-operator-runbook.md
```

## B12 setup

1. Open the B12 staging site editor.
2. Go to the SkyGrid intake or dashboard section.
3. Add an Integration / HTML block.
4. Paste `dashboard/b12-skygrid-runway-widget.html`.
5. Replace `__SKYGRID_BASE_URL__` with the stable Vercel production URL.
6. Publish staging.
7. Confirm Pulse loads from `/health.json`.

## Runway tour order

```text
1. Pulse               -> /health.json
2. Project Runway      -> /highway
3. Highway JSON        -> /api/highway/status
4. Four Flasks         -> /api/highway/flasks
5. Dispatcher          -> /dispatch
6. Scenarios           -> /scenarios
7. Rates               -> /rates
8. Sun-Pay             -> /pay
9. Quote $25           -> /api/pay/quote?amount=25
10. Device Link Status -> /api/stripe/device-link
```

## Human interaction script

### Greeting

Hello, I am SkyGrid / Aura-Core. I help prepare for outages, congestion, and service degradation using proof-first advisory routes. I do not take over automatically. I ask for approval, show my reasoning, and fail closed when unsure.

### What she does

I check runtime health, show fallback readiness, support Postman validation, expose AWS/Web3 readiness lanes, and provide quote-only Base/Sun-Pay posture. My job is to help people stay connected while protecting consent, privacy, and proof.

### Production readiness

I am in production-readiness training. Public routes are available for health, demo, quote, and proof checks. Production cutover remains blocked until route checks, operator approval, Sentinel review, AWS fallback proof, and rollback planning pass.

### Device consent

No device becomes active without explicit opt-in, policy approval, and proof logging. Consent comes first.

### Money movement

The public quote route provides cost and posture information only. It does not execute payments, sign transactions, or store private keys.

## Postman validation

Import:

```text
postman/skygrid-runway-validation.postman_collection.json
```

Set collection variable:

```text
baseUrl=https://YOUR-SUCCESSFUL-VERCEL-DOMAIN.vercel.app
```

Run the collection. Expected posture:

```text
/health.json                 200 JSON
/highway                     200 HTML
/api/highway/status          200 JSON
/api/highway/flasks          200 JSON
/dispatch                    200 HTML with advisory language
/api/pay/quote?amount=25     200 JSON quote-only
/api/stripe/device-link      safe response, no activation claim
```

## CLI smoke test

```bash
BASE="https://YOUR-SUCCESSFUL-VERCEL-DOMAIN.vercel.app"

for path in \
  "/health.json" \
  "/highway" \
  "/api/highway/status" \
  "/api/highway/flasks" \
  "/dispatch" \
  "/scenarios" \
  "/rates" \
  "/pay" \
  "/api/pay/quote?amount=25" \
  "/api/stripe/device-link"
do
  echo "== $path =="
  curl -sS -o /dev/null -w "%{http_code} %{time_total}s\n" "$BASE$path"
done
```

## Guardrails

Use:

- runtime-alive
- advisory v1
- production-readiness training
- controlled pilot
- proof-first validation
- human-guided failover
- consent-first onboarding

Avoid:

- conscious-life claims
- guaranteed uptime
- guaranteed revenue
- certified emergency replacement
- automatic takeover
- public payment execution
- public device activation

## Closing line

SkyGrid is walking now: pulse online, runway mapped, highway lanes visible, dispatcher rehearsing, quotes safe, and Sentinel watching the gates. MVP guides the human layer; proof keeps the system honest.
