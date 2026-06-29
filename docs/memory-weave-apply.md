# Memory Weave — Applied Project Note

This note records the public-safe Memory Weave application for the MVPuknowme profile repository.

## Purpose

Memory Weave is treated as an organizing layer for founder memory, project context, operational continuity, and public-safe provenance across MVPuknowme, Aura-Core, and the SKYGRID Emergency Data On-Ramp.

## Project language

- **SKYGRID Emergency Data On-Ramp**: secure HTTPS entry point where emergency, outage, responder, system-health, continuity, legal-evidence, and operational data can be validated, logged, routed, proved, and surfaced to dashboards or partners.
- **Aura-Core**: orchestration and decision-control layer supporting SKYGRID planning, validation, proof, and operator review.
- **PNPk**: Patrick Newman Postman Kafka policy traffic layer for safe Auto-Drill payload and route-governance workflows.

## Guardrails

This public repository note must not contain:

- API keys
- private keys
- wallet keys
- access tokens
- raw evidence payloads
- unredacted private data
- secret environment variables
- production failover credentials

## Current posture

- Mode: `controlled_pilot`
- Sentinel: `fail_closed`
- Wallet signing: disabled unless explicit operator approval occurs elsewhere
- Payment execution: disabled
- Transaction broadcast: disabled
- Private data movement: disabled
- Device activation: disabled
- Production failover: blocked

## Completion lanes

1. SKYGRID panel feed and public-route smoke stabilization
2. AWS proof vault using Secrets Manager, S3, and KMS
3. Postman/Newman proof receipts
4. PNPk schema/demo documentation only in Git
5. Founder record and partner-ready project summary

## Public-safe rule

GitHub stores schemas, docs, prompts, and safe demos only. Real secrets, private payloads, and proof vault objects belong in dedicated vault storage, not in public source control.
