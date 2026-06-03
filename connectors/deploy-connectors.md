# SkyGrid Connector Deployment Alignment

## Command

`/deploy connectors`

## Purpose

Align all available connector/workflow surfaces to the same SkyGrid language, ownership model, and controlled-pilot deployment flow.

This does not perform live production failover. It deploys the operating instructions for the connected tooling.

## Canonical service name

SKYGRID Emergency Data On-Ramp

## Canonical pilot offer

SkyGrid Emergency-Ready Infrastructure Preflight

## Connector map

```yaml
connectors:
  github:
    role: source_of_truth
    owns:
      - docs
      - runbooks
      - runtime code references
      - proof commits
      - repair prompts
    must_not_do:
      - claim routes are live without curl/postman proof

  vercel:
    role: public_runtime_front_door
    owns:
      - domain alias
      - landing route
      - health route
      - highway/demo/status routes
    current_blocker:
      - skygrid-protocol.net returns HTTP 404 for all tested routes
    required_fix:
      - attach skygrid-protocol.net to the project that owns aura-core-t2t5.vercel.app
      - or repair rewrites and api/runtime handler

  aws_q:
    role: emergency_data_on_ramp_backend
    owns:
      - intake validation
      - logs
      - Lambda/API health mirror
      - continuity data handling
      - proof references
    language_rule:
      - call it Emergency Data On-Ramp, not generic serverless

  postman_claude:
    role: validation_proof_lane
    owns:
      - route checks
      - response shape checks
      - advisory language checks
      - proof packet
    must_not_do:
      - treat itself as the product
      - execute payments or activate devices

  linear:
    role: execution_tracker
    owns:
      - blockers
      - tasks
      - gate status
      - launch sequence
      - follow-up fixes

  airtable:
    role: operations_dashboard
    owns:
      - route status
      - pilot contacts
      - proof references
      - last checked time
      - next action

  b12:
    role: public_intake_showcase
    owns:
      - partner intake
      - public copy
      - runway dashboard section
      - links to runtime/proof routes
    must_not_do:
      - act as backend runtime
      - claim certified emergency replacement

  skygrid_email:
    role: official_contact_identity
    owns:
      - mvpuknowme@skygrid-protocol.net
      - partner outreach
      - proof packet delivery
```

## Deployment sequence

### Phase 1: Language deployment

- Confirm all tools use `SKYGRID Emergency Data On-Ramp`.
- Confirm `serverless` is treated only as implementation detail.
- Confirm public language says controlled pilot, advisory, proof-first.

### Phase 2: Runtime deployment

- Connect `skygrid-protocol.net` to the correct Vercel project.
- Required target project: project that owns `aura-core-t2t5.vercel.app`.
- Rerun walk test.

### Phase 3: Proof deployment

- Run Postman validation collection.
- Save proof packet.
- Record results in Airtable or launch notes.

### Phase 4: Ops deployment

- Use Linear for unresolved blockers.
- Use Airtable for route and partner status.
- Use SkyGrid email for partner outreach.

## Health gates

```yaml
gates:
  domain:
    pass: skygrid-protocol.net resolves
    current: pass

  vercel_runtime:
    pass: /health.json returns 200
    current: fail_404

  postman:
    pass: collection validates public routes
    current: waiting_on_vercel_runtime

  aws_on_ramp:
    pass: AWS Q uses Emergency Data On-Ramp language and maps backend resources
    current: language_ready

  b12:
    pass: runway widget points to canonical domain
    current: ready_but_waiting_on_vercel_runtime

  email:
    pass: mvpuknowme@skygrid-protocol.net sends and receives
    current: pass
```

## Required public route walk test

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
  curl -sS -o /dev/null -w "HTTP %{http_code} | %{time_total}s\n" "$BASE$path"
done
```

## Connector instruction prompt

Use this for AWS Q, Claude/Postman, Vercel, Codex, or other agents:

```text
You are working on the SKYGRID Emergency Data On-Ramp, not a generic serverless application.

SkyGrid is a controlled-pilot infrastructure preflight service for emergency, outage, responder, system-health, and continuity data. The system intakes, validates, logs, routes, proves, and displays readiness signals while staying advisory, consent-first, and fail-closed.

Respect connector roles:
- Vercel is the public runtime/front door.
- AWS is the Emergency Data On-Ramp backend and health mirror.
- Postman is the proof/validation lane.
- Linear is the execution tracker.
- Airtable is the operations dashboard.
- B12 is the public intake/showcase layer.
- GitHub is the source of truth.

Do not execute payments.
Do not activate devices.
Do not perform production failover.
Do not move private data.

Current blocker: skygrid-protocol.net reaches Vercel but all required routes return 404. Fix by attaching the domain to the project that owns aura-core-t2t5.vercel.app or by repairing the runtime rewrites and api/runtime handler.
```

## Deployment status

```yaml
status: connector_alignment_deployed
next_action: fix_vercel_domain_or_route_attachment
sentinel: fail_closed
proof_required: yes
```
