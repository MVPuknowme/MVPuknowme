# Vercel Node / pnpm Alignment Patch

## Purpose

Repair the Vercel install failure for the SKYGRID Emergency Data On-Ramp runtime without changing public routes, rewrites, guardrails, Stripe/device-routing behavior, payment execution flags, or product language.

## Current failure

```text
ERR_PNPM_META_FETCH_FAIL GET https://registry.npmjs.org/ai:
Value of "this" must be of type URLSearchParams
```

## Required production-safe changes

### package.json

Change:

```json
"packageManager": "pnpm@11.1.3"
```

To:

```json
"packageManager": "pnpm@10.23.0"
```

Change:

```json
"ai": "latest"
```

To:

```json
"ai": "^5.0.0"
```

Change:

```json
"engines": {
  "node": ">=24 <25"
}
```

To:

```json
"engines": {
  "node": ">=22 <23"
}
```

### vercel.json — first pass

Keep all existing rewrites and headers unchanged.

Only change install/build commands to:

```json
"installCommand": "rm -rf node_modules ~/.local/share/pnpm/store && corepack enable && corepack prepare pnpm@10.23.0 --activate && pnpm config set registry https://registry.npmjs.org/ && pnpm install --no-frozen-lockfile",
"buildCommand": "corepack enable && corepack prepare pnpm@10.23.0 --activate && pnpm run build"
```

### Generate lockfile

Run locally, in Cloud Shell, GitHub Codespaces, or a safe Vercel-connected workspace:

```bash
corepack enable
corepack prepare pnpm@10.23.0 --activate
node -v
pnpm -v
pnpm install --no-frozen-lockfile
git status
git add package.json vercel.json pnpm-lock.yaml
git commit -m "Fix Vercel Node and pnpm install alignment"
git push
```

### vercel.json — second pass after successful lockfile deploy

Once the lockfile exists and Vercel install passes, switch to:

```json
"installCommand": "rm -rf node_modules ~/.local/share/pnpm/store && corepack enable && corepack prepare pnpm@10.23.0 --activate && pnpm config set registry https://registry.npmjs.org/ && pnpm install --frozen-lockfile"
```

Then commit:

```bash
git add vercel.json
git commit -m "Use frozen pnpm lockfile for Vercel builds"
git push
```

## Acceptance tests

```bash
BASE="https://skygrid-protocol.net"

for path in "/health.json" "/api/highway/status" "/api/stripe/device-link"; do
  echo "== $BASE$path =="
  curl -sS -o /dev/null -w "HTTP %{http_code} | %{time_total}s\n" "$BASE$path"
done
```

Expected:

```text
/health.json                 200
/api/highway/status          200
/api/stripe/device-link      200 safe staged/advisory response
```

## Guardrails

Do not rename SKYGRID as serverless.

Do not modify:

- route behavior
- rewrites beyond toolchain command alignment
- public guardrails
- Stripe/device routing logic
- payment execution flags
- device activation rules
- production failover rules

Sentinel remains fail-closed.
