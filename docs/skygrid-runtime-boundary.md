# SKYGRID Runtime Boundary

## Product name

Use the official name:

```text
SKYGRID Emergency Data On-Ramp
```

Vercel, AWS, OpenAI project metadata, serverless functions, API routes, Node runtime, and GitHub Actions are implementation details. They do not replace the product/system name.

## Public runtime role

The public runtime is a controlled-pilot front door for:

- route health
- status proof
- quote-only estimates
- public demo surfaces
- partner-facing readiness signals
- safe adoption documentation

## Public runtime must not perform

The public runtime must not perform:

- production emergency-service dispatch
- 911 replacement behavior
- carrier traffic cutover
- private data transfer
- device activation
- payment execution
- wallet transfer execution
- secret disclosure
- partner-only routing without authentication

## Safe public responses

Safe public routes may return:

- `200` route health
- JSON status envelopes
- advisory-mode HTML pages
- quote-only estimates
- staged device-link status with activation disabled
- proof metadata for Postman/Newman checks
- guardrail language

## Private/authenticated systems

Private/authenticated systems may later handle:

- partner registration
- authenticated device enrollment
- event intake persistence
- AWS logging and routing
- dashboard publication
- partner-specific proof trails
- payment execution after explicit authorization

Those systems require authentication, secrets management, access controls, audit logging, and legal/compliance review before production use.

## Required public smoke routes

```text
/
/health.json
/api/highway/status
/api/highway/postman
/api/pay/quote?amount=25
/api/stripe/device-link
```

## Pass condition

A public deployment is considered minimally healthy when:

- `/` returns HTML.
- `/health.json` returns valid JSON with `ok: true`.
- `/api/highway/status` returns valid JSON route status.
- `/api/highway/postman` returns valid JSON proof metadata.
- `/api/pay/quote?amount=25` returns quote-only JSON and does not execute payment.
- `/api/stripe/device-link` returns staged status and does not activate a device.

## Failure response

If any public route returns `404`, inspect:

1. Vercel project/domain attachment.
2. Production alias target.
3. `vercel.json` rewrites.
4. `api/runtime.mjs` entrypoint.
5. Runtime logs.

If any public route returns `500`, inspect:

1. Vercel runtime logs.
2. Node runtime version.
3. ESM import path errors.
4. Missing environment variables.
5. Syntax/runtime exceptions.
