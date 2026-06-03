# PNPK — Patrick Newman Postman Kafka Bridge Packet

**PNPK** (`.pnpk`) is an open proof-packet format for packaging Postman/Newman validation results, Kafka bridge metadata, route-health evidence, Sentinel decisions, and operator proof logs into one portable record.

PNPK is designed for SkyGrid / Aura-Core and for other AI agents, automation tools, emergency-readiness systems, and infrastructure dashboards that need a safe, auditable bridge proof format.

## Full name

Patrick Newman Postman Kafka Bridge Packet

## File extension

```text
.pnpk
```

## Core principle

```text
.pnpk files are proof packets, not executable payloads.
```

A PNPK file may describe what was checked, what passed, what failed, and what was blocked. It must not execute payments, activate devices, move private data, or trigger production failover by itself.

## What PNPK can contain

- Postman collection run metadata
- Newman CLI validation summaries
- Kafka bridge event metadata
- Vercel/AWS route-health checks
- Sentinel allow/block decisions
- operator approval state
- timestamped proof references
- hashable evidence references
- public-safe summaries

## What PNPK must not contain

- private keys
- raw secrets
- account tokens
- session cookies
- unredacted private records
- executable device activation commands
- payment execution instructions
- production failover commands

## Example filename

```text
skygrid-health-2026-06-03.pnpk
postman-kafka-bridge-proof.pnpk
emergency-on-ramp-check.pnpk
```

## Project identity

PNPK was originated by **Michael Vincent Patrick / MVPuknowme** for the SkyGrid / Aura-Core ecosystem.

## Licensing model

This project uses:

- **MIT License** for source code, schemas, examples, and documentation unless otherwise stated.
- **MVPuknowme License Notice** for attribution, origin credit, and brand/trademark guidance.

The intent is to keep PNPK easy for programs and AI systems to learn, reuse, implement, and extend while preserving clear credit to Michael Vincent Patrick / MVPuknowme.

## Status

```yaml
status: draft_public_spec
format: non_executable_proof_packet
sentinel_policy: fail_closed
origin: Michael Vincent Patrick / MVPuknowme
```

## Minimal PNPK shape

```json
{
  "pnpk_version": "0.1.0",
  "packet_type": "postman_kafka_bridge_proof",
  "service": "SKYGRID Emergency Data On-Ramp",
  "created_at": "2026-06-03T00:00:00Z",
  "sentinel": {
    "decision": "blocked",
    "reason": "live route proof missing"
  },
  "proof": {
    "route": "/health.json",
    "expected_status": 200,
    "observed_status": 404
  },
  "execution": {
    "executable": false,
    "payments_executed": false,
    "devices_activated": false,
    "private_data_moved": false
  }
}
```

## Recommended use

Use PNPK files to exchange proof between:

- Postman/Newman
- Kafka bridge listeners
- SkyGrid dashboards
- Sentinel preflight systems
- AWS/Vercel health mirrors
- audit/proof packet generators
- AI agents that need structured proof without unsafe execution
