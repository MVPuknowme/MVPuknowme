# Aura-Core OpenAI Project Adoption Plan

## Purpose

Adopt the local/OpenAI Aura-Core project inventory into GitHub as auditable project metadata for the SKYGRID Emergency Data On-Ramp.

This document is intentionally sanitized for a public repository. The uploaded CSV contained an OpenAI project identifier; the full identifier should stay out of public GitHub commits, issues, logs, screenshots, and support requests unless it is confirmed safe and necessary.

## Imported project record

| Field | Value |
| --- | --- |
| Name | Default project |
| Project ID | `proj_…xS8` |
| Geography | Global |
| Data retention | None |
| Members | 0 |
| Created | Sep 8, 2024 |
| Monthly spend (USD) | 0 |

## GitHub adoption target

The GitHub repository should become the control ledger for:

- project inventory
- runtime adoption status
- environment variable checklist
- route and deployment health checks
- public/private boundary decisions
- SKYGRID Emergency Data On-Ramp product language
- evidence of what is safe to publish versus what must remain secret

## Security boundary

Do not commit:

- OpenAI API keys
- GitHub tokens
- Vercel tokens
- AWS access keys
- Stripe secrets
- full OpenAI project identifiers unless explicitly approved
- wallet seed phrases, private keys, recovery phrases, or raw secret exports

Safe to commit:

- masked identifiers
- project names
- non-secret architecture notes
- route maps
- checklist status
- public deployment URLs
- advisory-mode demo behavior

## Adoption checklist

- [ ] Confirm the intended GitHub repository for Aura-Core/SKYGRID runtime ownership.
- [ ] Add sanitized project inventory to `docs/`.
- [ ] Create private `.env.example` guidance without real secrets.
- [ ] Map OpenAI project usage to runtime modules and scripts.
- [ ] Verify Vercel deployment points to the correct repo and branch.
- [ ] Confirm production domain attachment for `skygrid-protocol.net`.
- [ ] Keep public routes advisory/controlled-pilot only.
- [ ] Add GitHub Actions health checks for public routes.
- [ ] Add issue templates for deployment, security, and partner-pilot tasks.
- [ ] Decide whether detailed OpenAI project metadata belongs in a private repo or secure vault.

## Suggested repository files

```text
.env.example
docs/aura-core-openai-project-adoption.md
docs/skygrid-runtime-boundary.md
docs/skygrid-domain-operations.md
.github/ISSUE_TEMPLATE/deployment-check.md
.github/ISSUE_TEMPLATE/security-boundary.md
.github/workflows/skygrid-public-route-check.yml
```

## Product language

Use the official system name:

```text
SKYGRID Emergency Data On-Ramp
```

Implementation terms such as Vercel, AWS, serverless, API routes, and OpenAI project metadata are allowed only as implementation details. They should not replace the product name.

## Next command-center actions

1. Keep Cloudflare/Vercel/domain work separate from secret management.
2. Use GitHub for sanitized operational records.
3. Use a private vault or private repository for full identifiers and secrets.
4. Run a public route check after each Vercel deployment.
5. Promote the working Vercel deployment only after `/`, `/health.json`, `/api/highway/status`, and quote-only endpoints return healthy responses.
