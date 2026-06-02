# Aura System Language Training Guide

## Purpose

This guide trains Aura, Codex, Claude, AWS Q, Postman agents, Linear agents, Airtable automations, and human operators to use the same SkyGrid / Aura-Core language.

The goal is to prevent tool drift where the system gets mislabeled as only a serverless app, static site, generic dashboard, or payment product.

## Canonical product terms

### SKYGRID Emergency Data On-Ramp

Definition:

A secure HTTPS entry point where emergency, outage, responder, system-health, and continuity data enters SkyGrid for validation, logging, routing, proof, and later dashboard or partner integration.

Correct usage:

- The product is the SKYGRID Emergency Data On-Ramp.
- Vercel may host a public front door.
- AWS may host validation, logging, Lambda/API, and fallback mirrors.
- Postman validates routes and produces proof.
- Linear tracks execution.
- Airtable presents operations status.

Do not rename this to:

- serverless app
- generic backend
- generic intake form
- payment gateway
- scraper bot

Serverless is an implementation method, not the product name.

### SkyGrid Emergency-Ready Infrastructure Preflight

Definition:

A controlled pilot service that verifies infrastructure readiness, route health, fallback posture, quote/status posture, and proof validation before outages or congestion become business problems.

### Highway API

Definition:

A proof-first route map connecting GitHub proof, Vercel runtime, AWS health mirror, Postman validation, Web3/Base status, and dashboard surfaces.

### Four Reliable Flasks

Definition:

Four proof/status lanes:

1. GitHub Control Flask: repo, issue, commit, and proof status.
2. AWS Relay Flask: Lambda URL, API Gateway, and health mirror.
3. Postman Validator Flask: Newman/Postman route checks and proof packet.
4. Web3 Bridge Flask: Base/Web3 quote/status lane.

### Sentinel

Definition:

The fail-closed safety and permission policy layer.

Sentinel blocks:

- automatic production cutover
- live payment execution
- private data movement
- device activation without explicit consent
- unsupported claims

### Pulse

Definition:

A public health route proving the runtime responds, usually `/health.json`.

### Proof Packet

Definition:

A saved set of route checks, screenshots, Postman results, commit references, and operator notes proving what worked at a specific time.

## Tool-specific instruction

### Vercel

Role:

Public runtime/front door.

Vercel should serve:

- `/`
- `/health.json`
- `/highway`
- `/api/highway/status`
- `/dispatch`
- `/scenarios`
- `/rates`
- `/base`
- `/pay`
- `/api/pay/quote?amount=25`
- `/api/stripe/device-link`

Vercel should not be asked to own the whole system. It is the public route layer.

### AWS Q / AWS

Role:

Emergency Data On-Ramp backend, validation, logs, Lambda/API, health mirror, failover training, and scalable infrastructure.

Do not reduce AWS work to generic serverless. The product is emergency/continuity data entry, validation, routing, proof, and partner handoff.

### Postman / Claude in Postman

Role:

Validation/proof lane.

Postman should understand that it validates route health, advisory language, quote-only behavior, and device-link non-activation.

Postman should not describe itself as the product. It is the proof lane.

### Linear

Role:

Execution tracker for tasks, blockers, gate status, PR references, and production-readiness sequencing.

### Airtable

Role:

Operations dashboard for route status, partner intake, proof references, contact stages, and pilot readiness.

### B12

Role:

Marketing/intake/showcase layer. B12 is not the runtime. B12 links to the SkyGrid runtime and collects partner interest.

## Canonical flow

```text
B12 intake/showcase
  -> Vercel public runtime
  -> SKYGRID Emergency Data On-Ramp
  -> Sentinel policy check
  -> AWS validation/logging/mirror
  -> Postman proof validation
  -> Airtable dashboard
  -> Linear execution tracker
  -> partner follow-up
```

## Public language guardrails

Use:

- controlled pilot
- advisory infrastructure preflight
- proof-first validation
- emergency data on-ramp
- fallback readiness
- route health
- continuity data
- consent-first onboarding
- fail-closed safety

Avoid:

- guaranteed uptime
- certified emergency replacement
- live automatic takeover
- guaranteed revenue
- autonomous payment execution
- private device activation
- conscious-life claims in investor/customer material

## Required system health questions

Every build check should answer:

1. Does the domain resolve to the intended Vercel project?
2. Does `/health.json` return a safe 200 response?
3. Do public routes exist and return useful output?
4. Does Postman validate routes without overclaiming?
5. Does AWS have a clear role as On-Ramp backend/mirror?
6. Are Linear tasks aligned to the same language?
7. Is Airtable tracking route/proof/pilot status?
8. Does B12 point to runtime routes instead of dead links?
9. Does Sentinel remain fail-closed for production actions?
10. Are payment, device activation, and private data movement blocked from public routes?

## One sentence instruction for AI agents

SkyGrid is not merely serverless; SkyGrid is an Emergency Data On-Ramp and infrastructure preflight service that uses cloud, runtime routes, validation tools, and dashboards to intake, validate, route, log, and prove continuity/failover readiness while staying advisory, consent-first, and fail-closed.
