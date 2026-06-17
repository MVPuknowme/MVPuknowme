# SKYGRID Domain Operations

## Domain custody goal

Protect the SKYGRID brand and keep the public front door stable.

The intended canonical production domain is:

```text
https://skygrid-protocol.net
```

The currently verified Vercel preview/runtime target is:

```text
https://aura-core-t2t5.vercel.app
```

## Recommended custody model

Use Cloudflare or another reputable registrar for:

- domain purchase and renewal
- DNS control
- DNSSEC
- registrar lock
- account-level MFA
- WHOIS/privacy redaction where available

Use Vercel for:

- active public runtime deployment
- production/preview deployment separation
- GitHub-driven deploys
- custom-domain attachment to the correct project

## Standard Vercel DNS pattern

Use the exact DNS records Vercel shows for the target project. The common pattern is:

```text
A      @      76.76.21.21
CNAME  www    cname.vercel-dns.com
```

Do not assume those values if Vercel displays project-specific instructions.

## Domain attachment checklist

- [ ] Confirm the correct Vercel project owns the working deployment.
- [ ] Confirm the production branch is the intended branch.
- [ ] Add `skygrid-protocol.net` to the correct Vercel project.
- [ ] Add `www.skygrid-protocol.net` to the same Vercel project.
- [ ] Remove the domain from any wrong Vercel project if Vercel reports a conflict.
- [ ] Confirm DNS records at the registrar/DNS provider.
- [ ] Confirm SSL/TLS is issued and active.
- [ ] Run `SKYGRID Public Route Check` from GitHub Actions.
- [ ] Confirm `/`, `/health.json`, `/api/highway/status`, and quote-only endpoints return healthy responses.

## Brand-reservation candidates

Reserve high-priority names where available:

```text
skygridprotocol.com
skygridprotocol.net
skygrid-protocol.com
skygrid-protocol.net
skygridonramp.com
skygrid-emergency.com
skygridresilience.com
skygridcontinuity.com
auraskygrid.com
aura-core.net
```

## Priority order

```text
1. skygridprotocol.com
2. skygrid-protocol.net
3. skygridonramp.com
4. skygridresilience.com
5. auraskygrid.com
```

## Operating rule

Cloudflare/DNS work is brand custody and traffic steering.

Vercel work is runtime deployment.

GitHub work is source, proof, checks, and control ledger.

Secrets and full project identifiers belong in a private vault or local secure store, not public GitHub.
