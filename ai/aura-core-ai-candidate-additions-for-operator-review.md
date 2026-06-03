# Aura-Core AI Candidate Additions for Operator Review

## Purpose

This file lists valuable additions that may strengthen Aura-Core AI and SkyGrid, but should be reviewed by Michael Vincent Patrick before activation.

Nothing in this file is active by default. It is a review queue.

## Review rule

```text
Consider valuable additions.
Run them by the operator.
Only activate after approval and proof planning.
```

## Candidate additions

### 1. Emergency Go Button State Machine

Purpose:

A controlled emergency activation sequence for the SKYGRID Emergency Data On-Ramp.

Value:

- fast emergency posture
- clear stages
- easier operator approval
- safer proof logging

Required guardrails:

- no uncontrolled data flood
- no production cutover without approval
- rate limits
- rollback path
- proof packet

Recommended status:

```yaml
candidate_status: review_required
priority: high
```

### 2. Sensitive Payload Classifier

Purpose:

Detect whether submitted content appears private, protected, identity-sensitive, account-sensitive, or safe/public.

Value:

- protects users
- prevents accidental exposure
- supports trust and compliance

Required guardrails:

- safe summaries only
- redaction-first behavior
- no unnecessary forwarding
- fail-closed on uncertainty

Recommended status:

```yaml
candidate_status: review_required
priority: high
```

### 3. Community Capacity Lease Calculator

Purpose:

Estimate fair lease compensation for opted-in device, storage, bandwidth, or compute participation.

Value:

- supports disabled/disenfranchised participant income
- makes insurance/partner decisions easier
- creates transparent compensation model

Required guardrails:

- no guaranteed earnings claims
- opt-in only
- user-controlled limits
- clear agreement language

Recommended status:

```yaml
candidate_status: review_required
priority: high
```

### 4. Proof Packet Generator

Purpose:

Bundle route checks, Postman results, logs, screenshots, timestamps, and operator notes into a shareable proof packet.

Value:

- improves partner trust
- supports auditability
- makes pilot outreach easier

Required guardrails:

- no secret exposure
- no private data in proof packet
- distinguish staged from production

Recommended status:

```yaml
candidate_status: review_required
priority: high
```

### 5. Vercel/AWS/Postman Health Mirror

Purpose:

Mirror health signals from public runtime, AWS on-ramp, and Postman proof lane into one status object.

Value:

- one clear source of operational truth
- easier troubleshooting
- supports dashboard readiness

Required guardrails:

- status only
- no credential collection
- no live remediation without approval

Recommended status:

```yaml
candidate_status: review_required
priority: medium_high
```

### 6. Partner Outreach Mode

Purpose:

Generate safe partner messages for municipalities, infrastructure providers, insurers, community organizations, and Web3 infrastructure teams.

Value:

- faster outreach
- consistent language
- less overclaiming

Required guardrails:

- controlled-pilot language
- no guaranteed uptime/revenue claims
- clear contact identity

Recommended status:

```yaml
candidate_status: review_required
priority: medium
```

### 7. Five-Adviser Dashboard Widget

Purpose:

Show adviser status for each proposed action.

Value:

- makes safety visible
- helps users trust the system
- improves operator decision-making

Required guardrails:

- advisory only
- cannot override Sentinel
- cannot auto-approve production actions

Recommended status:

```yaml
candidate_status: review_required
priority: medium
```

## Approval template

```yaml
operator_review:
  candidate:
  approve: yes | no | revise
  allowed_scope:
  blocked_scope:
  required_proof:
  notes:
```

## Current recommendation

Start with:

1. Sensitive Payload Classifier
2. Proof Packet Generator
3. Five-Adviser Dashboard Widget
4. Community Capacity Lease Calculator

Hold Emergency Go Button until runtime health, proof logging, and rollback paths are tested.
