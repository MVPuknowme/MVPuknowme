# SkyGrid Full Systems Health Check

## Purpose

Run a full health check across the SkyGrid / Aura-Core build surfaces and eliminate language confusion between Vercel, AWS Q, Claude in Postman, Linear, Airtable, and B12.

## Canonical service name

SKYGRID Emergency Data On-Ramp

## Canonical pilot offer

SkyGrid Emergency-Ready Infrastructure Preflight

## Health posture

```yaml
mode: controlled_pilot
language: advisory
sentinel: fail_closed
public_domain: https://skygrid-protocol.net
email_identity: mvpuknowme@skygrid-protocol.net
```

## 1. Domain health

Check:

```bash
curl -I https://skygrid-protocol.net/
curl -I https://skygrid-protocol.net/health.json
```

Pass:

- Domain reaches intended Vercel project.
- `/health.json` returns 200.
- No Vercel `NOT_FOUND` for required public routes.

Fail signs:

- Domain reaches Vercel but returns `NOT_FOUND`.
- Apex domain points to wrong project.
- Preview deployment works but production alias fails.

## 2. Vercel route health

Required routes:

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

CLI check:

```bash
BASE="https://skygrid-protocol.net"

for path in \
  "/" \
  "/health.json" \
  "/highway" \
  "/api/highway/status" \
  "/api/highway/flasks" \
  "/api/highway/postman" \
  "/dispatch" \
  "/scenarios" \
  "/rates" \
  "/base" \
  "/pay" \
  "/api/pay/quote?amount=25" \
  "/api/stripe/device-link"
do
  echo "== $path =="
  curl -sS -o /dev/null -w "%{http_code} %{time_total}s\n" "$BASE$path"
done
```

Pass:

- Public demo/status routes return 200 or a clearly documented safe staged response.
- Quote route is quote-only.
- Device-link route does not claim live activation.

## 3. AWS Emergency Data On-Ramp health

AWS should be described as:

- validation backend
- logging backend
- health mirror
- Lambda/API relay
- continuity data processing layer

Do not describe AWS as only serverless.

Check:

```text
AWS route name: SKYGRID Emergency Data On-Ramp
Function: intake, validate, log, route, prove, mirror
```

Pass:

- AWS Q and docs use Emergency Data On-Ramp language.
- Lambda/API Gateway/CloudWatch resources map to intake, validation, logging, proof, or health mirror.
- No uncontrolled production failover from public routes.

## 4. Postman / Claude validation health

Postman should validate:

- route health
- JSON response shape
- advisory language
- quote-only behavior
- device-link non-activation
- no guaranteed claims

Import:

```text
postman/skygrid-runway-validation.postman_collection.json
```

Set:

```text
baseUrl=https://skygrid-protocol.net
```

Pass:

- Collection runs.
- Failures are documented as staged, blocked, or route-missing.
- Claude/Postman calls this a proof lane, not the product itself.

## 5. Linear health

Linear should track:

- launch checklist
- route blockers
- Vercel fixes
- AWS on-ramp work
- Postman proof results
- Airtable dashboard updates
- partner outreach

Pass:

- Issue titles use SkyGrid / Emergency Data On-Ramp / Preflight language.
- No issue renames the system to generic serverless.

## 6. Airtable health

Airtable should track:

- route name
- URL
- status
- last checked time
- result code
- proof reference
- owner
- next action

Recommended fields:

```text
Route Name
URL
Layer
Status
Last Checked
HTTP Code
Proof Reference
Next Action
Owner
Notes
```

Pass:

- Airtable is operations dashboard, not source-of-truth code.
- Records distinguish B12, Vercel, AWS, Postman, Web3/Base, and Sentinel roles.

## 7. B12 health

B12 should do:

- public intake
- runway/showcase
- partner contact
- link to runtime proof routes

B12 should not do:

- live failover
- payment execution
- private device activation
- backend validation

Pass:

- SkyGrid intake page has the canonical email.
- Buttons point to `https://skygrid-protocol.net` routes.
- Public language says controlled pilot, advisory, proof-first.

## 8. Sentinel safety health

Pass only if public surfaces block:

- live cutover
- payment execution
- private data movement
- device activation without consent
- unsupported uptime/revenue claims

Sentinel status:

```yaml
sentinel:
  default: fail_closed
  allowed_public_actions:
    - route_probe
    - status_read
    - quote_preview
    - proof_validation
    - intake_submission
  blocked_public_actions:
    - production_cutover
    - payment_execution
    - private_data_transfer
    - device_activation
```

## Health report template

```yaml
skygrid_health_report:
  timestamp:
  operator: Michael Vincent Patrick
  domain_status:
  vercel_routes:
  aws_on_ramp:
  postman_validation:
  linear_alignment:
  airtable_dashboard:
  b12_intake:
  sentinel_status:
  blockers:
  next_actions:
```

## Overall pass condition

SkyGrid is healthy enough for pilot outreach when:

- Email identity works.
- Domain resolves.
- `/health.json` works or the blocker is clearly documented.
- B12 links to the canonical domain.
- Postman proof lane exists.
- AWS role is named Emergency Data On-Ramp.
- Sentinel remains fail-closed.
- Public language stays advisory and controlled-pilot.
