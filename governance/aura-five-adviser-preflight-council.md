# Aura Five-Adviser Preflight Council

## Purpose

The Aura Five-Adviser Preflight Council is an advisory governance pattern for SkyGrid / Aura-Core.

It helps Aura, Codex, AWS Q, Postman/Claude, Linear, Airtable, B12, and human operators evaluate route changes, data movement, device participation, failover, payment posture, and public claims before action.

The advisers do not execute production actions. They recommend, classify, and document. Sentinel gates. The operator approves. The system logs proof.

## Core rule

```text
Advisers recommend.
Sentinel gates.
Operator approves.
Proof logs record.
```

## The Five Advisers

### 1. Sentinel Safety Adviser

Role:

- risk classification
- fail-closed decisioning
- production-action guardrails
- emergency-mode boundaries
- human/operator review triggers

Blocks:

- unclear authority
- unknown device/user consent
- production cutover without approval
- live payment execution from public routes
- data moves with incomplete classification

### 2. Route Infrastructure Adviser

Role:

- Vercel route health
- AWS Emergency Data On-Ramp backend/mirror
- Postman validation lane
- Kafka bridge event routing
- Web3/Base quote/status posture
- domain/runtime readiness

Checks:

- `/health.json`
- `/api/highway/status`
- `/api/stripe/device-link`
- Vercel build/install status
- AWS on-ramp health mirror
- Postman proof run

### 3. Data Privacy Adviser

Role:

- protect private files, messages, photos, medical data, wallets, keys, tokens, STS credentials, session cookies, and identity material
- classify payload sensitivity
- require redaction/hashing/proof references instead of raw secret logging

Blocks:

- raw token exposure
- unredacted credential URLs
- private data transfer without consent
- third-party forwarding of sensitive payloads

### 4. Community Capacity Adviser

Role:

- opted-in device/storage/network participation
- community capacity leasing
- lease/payment fairness
- disabled/disenfranchised participant protections
- device limits, power limits, bandwidth limits, and off-switch requirements

Blocks:

- device use without explicit opt-in
- unclear compensation terms
- excessive battery/storage/network use
- mining/drilling/compute use without contract and policy approval

### 5. Proof & Audit Adviser

Role:

- proof packets
- signed receipts
- route check records
- timestamped logs
- evidence preservation
- after-action review

Requires logs for:

- route changes
- data move preflights
- emergency on-ramp activation
- blocked token/credential handling
- device onboarding
- payment quote or processor readiness checks

## Required preflight output

Every significant SkyGrid action should produce:

```yaml
preflight:
  action:
  source:
  destination:
  data_type:
  sensitivity:
  consent_status:
  route_status:
  community_capacity_impact:
  sentinel_decision:
  proof_required:
  operator_approval_required:
  final_status:
```

## Adviser decision statuses

```yaml
statuses:
  ready: safe to continue to next gate
  pending: missing information or waiting on proof
  blocked: do not continue until fixed
  unsafe: stop and escalate to operator
  completed: checked and recorded
```

## Production gate

No production move, payment execution, device activation, or failover route switch is allowed unless all five advisers produce either `ready` or a documented `not_applicable`, Sentinel permits the action, and the operator approval path is satisfied.

## Public-language guardrails

Use:

- controlled pilot
- advisory preflight
- consent-first
- proof-first
- fail-closed
- community capacity leasing
- emergency data on-ramp
- route health
- fallback readiness
- continuity proof

Avoid:

- guaranteed uptime
- certified emergency replacement
- automatic takeover
- unlimited storage
- uncontrolled data flood
- autonomous payment execution
- private device activation

## One-sentence agent instruction

Before acting, run the Aura Five-Adviser Preflight Council: check Sentinel safety, infrastructure route health, data privacy, community capacity impact, and proof/audit requirements; if any adviser blocks or uncertainty remains, fail closed and request operator review.
