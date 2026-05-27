# SkyGrid Fast Service Finish Plan

## Purpose

Finish the SkyGrid service fast enough to protect the opportunity without overbuilding.

This is the minimum credible service package:

- B12 public dashboard
- stable Vercel runtime URL
- health/pulse route
- Highway API route map
- dispatcher demo
- scenario training page
- Base/rates page
- Sun-Pay quote-only page
- device-link status route
- Postman proof collection
- operator runbook

## Service offer

### Name

SkyGrid Emergency-Ready Infrastructure Preflight

### One-line offer

SkyGrid helps teams verify infrastructure readiness, route health, and fallback posture before outages or congestion become business problems.

### Public posture

```yaml
mode: controlled_pilot
language: advisory
sentinel: fail_closed
public_runtime:
  allowed:
    - status checks
    - demo views
    - quote-only estimates
    - proof validation
    - intake submission
  blocked:
    - live traffic cutover
    - payment execution
    - private data movement
    - device activation without consent
```

## The three fast paths

### Path 1: Sell the preflight

Use this when speed matters most.

- Button: Start Preflight Check
- Route: `/health.json` and `/highway`
- Outcome: a simple proof packet showing runtime status, route map, and advisory readiness.
- Customer promise: readiness assessment, not guaranteed failover.

### Path 2: Sell the partner review

Use this for B2B / ISP / emergency services conversations.

- Button: Request Partner Review
- Route: B12 intake form plus `/api/highway/status`
- Outcome: captured lead, organization type, region, and requested proof packet.
- Customer promise: review and pilot scoping.

### Path 3: Sell the quote/status service

Use this for Web3/Base/Sun-Pay conversations.

- Button: Quote $25 / Check Base Rate
- Route: `/api/pay/quote?amount=25`, `/rates`, `/base`
- Outcome: quote-only posture with no payment execution.
- Customer promise: routing-cost estimate and rate-band visibility.

## Finish checklist

### B12

- Add `dashboard/b12-skygrid-runway-widget.html` to the SkyGrid intake section.
- Replace `__SKYGRID_BASE_URL__` with the stable Vercel production URL.
- Keep language: advisory, controlled pilot, proof-first.
- Make buttons useful:
  - Pulse -> `/health.json`
  - Project Runway -> `/highway`
  - Dispatcher -> `/dispatch`
  - Scenarios -> `/scenarios`
  - Rates -> `/rates`
  - Sun-Pay -> `/pay`
  - Quote $25 -> `/api/pay/quote?amount=25`
  - Device Link -> `/api/stripe/device-link`

### Vercel / runtime

Required public routes:

```text
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
```

### Postman

Import:

```text
postman/skygrid-runway-validation.postman_collection.json
```

Set:

```text
baseUrl=https://YOUR-STABLE-VERCEL-DOMAIN.vercel.app
```

Run the collection and save results as proof.

### GitHub proof

Keep these files visible:

```text
dashboard/b12-skygrid-runway-widget.html
postman/skygrid-runway-validation.postman_collection.json
docs/skygrid-runway-operator-runbook.md
docs/skygrid-fast-service-finish.md
```

## 90-minute execution order

### First 15 minutes

- Confirm stable Vercel production URL.
- Paste the B12 widget.
- Replace `__SKYGRID_BASE_URL__`.

### Next 15 minutes

- Click every dashboard button.
- Confirm each opens the intended runtime route.
- Keep any broken route hidden or relabeled as staged.

### Next 20 minutes

- Import Postman collection.
- Set `baseUrl`.
- Run proof checks.
- Save screenshot/result.

### Next 20 minutes

- Update B12 copy:
  - advisory readiness
  - controlled pilot
  - proof packet available
  - partner review available

### Final 20 minutes

- Send the offer link to one target partner.
- Use the pitch below.

## Fast pitch

SkyGrid is ready for a controlled infrastructure preflight pilot.

The service checks runtime health, route readiness, fallback posture, Base/Web3 quote posture, and proof validation through a public-safe dashboard. It is advisory, consent-first, and fail-closed: no live cutover, no payment execution, and no device activation without approval.

What we can deliver immediately:

1. A public preflight dashboard.
2. A proof packet using Postman route validation.
3. A partner review workflow for infrastructure readiness.

The goal is simple: show whether the network is ready before stress, congestion, or outage conditions force a reaction.

## Do not wait for

- full automation
- perfect AWS failover
- live payments
- full device onboarding
- complete ISP agreements

Those are phase two. The opportunity is protected by shipping the preflight service now.
