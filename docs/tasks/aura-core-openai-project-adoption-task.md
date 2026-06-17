# Task: Adopt Aura-Core OpenAI Project Metadata Into GitHub

## Goal

Adopt the Aura-Core OpenAI project CSV into GitHub as a sanitized control ledger for the SKYGRID Emergency Data On-Ramp.

## Imported CSV snapshot

- Name: Default project
- Project ID: `proj_…xS8` masked for public repository safety
- Geography: Global
- Data retention: None
- Members: 0
- Created: Sep 8, 2024
- Monthly spend: 0 USD

## Security boundary

Do **not** publish full OpenAI project IDs, API keys, tokens, wallet secrets, Vercel tokens, AWS credentials, Stripe secrets, or raw secret exports in public GitHub.

## Execution queue

- [x] Confirm repo ownership and deployment reality: Vercel project `aura-core` is the currently healthy runtime target; `aura-core-t2t5` is returning route 404s.
- [x] Keep sanitized project metadata in `docs/aura-core-openai-project-adoption.md`.
- [x] Add `.env.example` with variable names only, no real values.
- [x] Add route-health GitHub Action for `/`, `/health.json`, `/api/highway/status`, `/api/highway/postman`, and `/api/pay/quote?amount=25`.
- [ ] Add deployment and security issue templates if repository Issues are enabled later.
- [ ] Decide where full sensitive project metadata should live: private repo, vault, or local-only.
- [ ] Attach `skygrid-protocol.net` to the healthy Vercel project rather than the 404 project.
- [x] Keep public routes controlled-pilot/advisory only.

## Verified live targets

```text
https://aura-core.vercel.app
https://aura-core-mvpuknowme-home-e539c0b1.vercel.app
```

Use `https://aura-core.vercel.app` as the public alias for route checks and outreach until `skygrid-protocol.net` is attached to the healthy Vercel project.

## Route notes

- `https://aura-core-t2t5.vercel.app/health.json` returned `404` during verification.
- `https://aura-core-t2t5.vercel.app/api/highway/status` returned `404` during verification.
- `https://aura-core.vercel.app/health.json` returned `200` JSON during verification.
- `https://aura-core.vercel.app/api/highway/status` returned `200` JSON during verification.
- `https://aura-core.vercel.app/api/highway/postman` returned `200` JSON-compatible response during verification.
- `https://aura-core.vercel.app/api/pay/quote?amount=25` returned `200` quote-only JSON during verification.

## Product language

Use **SKYGRID Emergency Data On-Ramp** as the product/system name. Vercel, AWS, OpenAI project metadata, and serverless runtime details are implementation details only.
