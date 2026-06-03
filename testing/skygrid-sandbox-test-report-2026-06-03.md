# SkyGrid Sandbox Test Report — 2026-06-03

## Scope

Safe sandbox testing only. No production Vercel/AWS dashboards were modified. No private tokens or credentials were used.

## Public endpoint probe

Assistant-side network probing could not confirm the public endpoints because the sandbox DNS/fetch layer could not resolve or fetch the domains. This is not a production verdict.

Use operator-side Terminal, Cloud Shell, or Postman for live route proof.

## Local deterministic sandbox checks

A local test harness simulated:

- SkyGrid public runtime route behavior
- guarded quote route behavior
- staged device-link behavior
- Aura Five-Adviser preflight decisions
- dependency/runtime patch assumptions

## Results

```text
SKYGRID SANDBOX TEST REPORT
===========================
Total checks: 24
Passed: 24
Failed: 0
```

## Route simulation

All required route simulations returned 200 in the local handler model:

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

## Guardrail simulation

Passed:

- quote route is non-executing
- device-link route is staged and consent-gated
- public device activation is blocked
- sensitive data movement is blocked
- unclear capacity lease terms are blocked

## Five-Adviser checks

Passed:

```yaml
five_adviser_scenarios:
  safe_public_quote_preview: ready
  public_device_activation: blocked
  sensitive_data_move: blocked
  unclear_capacity_lease: blocked
```

## Config patch assumptions tested

Passed:

```yaml
config_patch_assumptions:
  packageManager: pnpm@10.23.0
  node_engine: ">=22 <23"
  ai_dependency: pinned_not_latest
  stripe_dependency: retained
  first_pass_install: pnpm_install_no_frozen_lockfile
```

## What this proves

This proves the proposed safe behavior and guardrail model are internally consistent in sandbox.

## What this does not prove

This does not prove:

- Vercel production deploy is fixed
- DNS is globally healthy
- `/health.json` is live in production
- `pnpm-lock.yaml` has been generated and committed in the runtime repo
- Vercel install has passed
- AWS health mirror is live

## Required live proof next

Run from operator Terminal, Cloud Shell, or Postman:

```bash
BASE="https://skygrid-protocol.net"

for path in "/" "/health.json" "/highway" "/api/highway/status" "/api/pay/quote?amount=25" "/api/stripe/device-link"; do
  echo "== $BASE$path =="
  curl -sS -o /dev/null -w "HTTP %{http_code} | %{time_total}s\n" "$BASE$path"
done
```

Pass condition:

```text
/health.json                 200
/api/highway/status          200
/api/stripe/device-link      200 safe staged/advisory response
```

## Sentinel status

```yaml
sentinel: fail_closed
public_routes: advisory_only
payments: no_execution
devices: no_activation_without_consent
production_failover: blocked_until_operator_approval_and_proof
```
