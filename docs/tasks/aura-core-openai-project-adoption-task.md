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

- [ ] Confirm repo ownership and whether canonical runtime lives here or in a separate Aura-Core repo.
- [ ] Keep sanitized project metadata in `docs/aura-core-openai-project-adoption.md`.
- [ ] Add `.env.example` with variable names only, no real values.
- [ ] Add route-health GitHub Action for `/`, `/health.json`, `/api/highway/status`, and `/api/pay/quote?amount=25`.
- [ ] Add deployment and security issue templates if repository Issues are enabled later.
- [ ] Decide where full sensitive project metadata should live: private repo, vault, or local-only.
- [ ] Confirm Vercel project and custom domain attachment for `skygrid-protocol.net`.
- [ ] Keep public routes controlled-pilot/advisory only.

## Product language

Use **SKYGRID Emergency Data On-Ramp** as the product/system name. Vercel, AWS, OpenAI project metadata, and serverless runtime details are implementation details only.
