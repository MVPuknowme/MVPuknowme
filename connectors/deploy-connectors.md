# SkyGrid Connector Deployment Alignment

## Command

`/deploy connectors`

## Purpose

Align all available connector/workflow surfaces to the same SkyGrid language, ownership model, and controlled-pilot deployment flow.

This does not perform live production failover. It deploys the operating instructions for the connected tooling.

## Canonical service name

SKYGRID Emergency Data On-Ramp

## Canonical app/interface domain

```text
https://aurcore.skygrid-protocol.net
```

All apps and interfaces route through this domain once DNS and Vercel aliasing are active.

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
      - aurcore.skygrid-protocol.net domain alias
      - landing route
      - health route
      - highway/demo/status routes
    canonical_target:
      - https://aurcore.skygrid-protocol.net
    fallback_proof_target:
      - https://aura-core.vercel.app
    stale_target_do_not_use:
      - https://aura-core-t2t5.vercel.app
      - https://skygrid-protocol.net
    current_blocker:
      - aurcore.skygrid-protocol.net needs final Vercel domain attachment and DNS verification
    required_fix:
      - attach aurcore.skygrid-protocol.net to the project that owns the healthy aura-core.vercel.app runtime
      - add DNS CNAME aurcore -> cname.vercel-dns.com unless Vercel provides a project-specific value
      - remove stale aura-core-t2t5 and parent-domain references from public copy, checks, and partner outreach

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

- Connect `aurcore.skygrid-protocol.net` to the correct Vercel project.
- Required fallback proof target while DNS is pending: `https://aura-core.vercel.app`.
- Do not use `https://aura-core-t2t5.vercel.app` as a route target unless it is revalidated.
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
    pass: aurcore.skygrid-protocol.net resolves and points to healthy aura-core runtime
    current: pending_attachment_verification

  vercel_runtime:
    pass: /health.json returns 200
    current: pass_on_aura_core_vercel_app_fallback

  postman:
    pass: collection validates public routes
    current: ready_to_run_against_aurcore_after_dns

  aws_on_ramp:
    pass: AWS Q uses Emergency Data On-Ramp language and maps backend resources
    current: language_ready

  b12:
    pass: runway widget points to aurcore.skygrid-protocol.net
    current: needs_link_update_after_domain_alias

  email:
    pass: mvpuknowme@skygrid-protocol.net sends and receives
    current: pass
```

## Required public route walk test

```bash
BASE="https://aurcore.skygrid-protocol.net"

for path in \
  "/" \
  "/health.json" \
  "/api/highway/status" \
  "/api/highway/postman" \
  "/api/pay/quote?amount=25"
do
  echo "== $path =="
  curl -sS -o /dev/null -w "HTTP %{http_code} | %{time_total}s\n" "$BASE$path"
done
```

Fallback proof test while DNS is pending:

```bash
BASE="https://aura-core.vercel.app"
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

Current blocker: aurcore.skygrid-protocol.net must be attached to the healthy Vercel project that serves https://aura-core.vercel.app. Do not route partners to stale aura-core-t2t5 links or the parent domain as the app/interface URL.
```

## Deployment status

```yaml
status: connector_alignment_deployed
next_action: attach_aurcore_subdomain_to_healthy_aura_core_project
sentinel: fail_closed
proof_required: yes
```
