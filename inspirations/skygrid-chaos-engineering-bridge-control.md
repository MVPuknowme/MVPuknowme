# SKYGRID Chaos Engineering — Bridge-Control API Collection

## Status

The Postman collection for the SKYGRID Emergency Data On-Ramp bridge-control API has been created and instrumented.

Collection:

```text
SKYGRID Emergency Data On-Ramp bridge-control API
collection/50503657-ff26b99a-fc68-43f7-b75a-c8aad377451d
```

## Protocol language

```text
Chaos engineering = controlled operational rehearsal
Auto Drill = non-executing resilience rehearsal
Bridge Guard = staging/proof-only control gate
Postman/Newman JSON = raw route-test evidence
preflight .pnpk = canonical SKYGRID portable proof packet
Sentinel = allow/block/preflight-only decision layer
```

## Purpose

This collection validates the SKYGRID bridge-control path before any production bridge execution is allowed.

The collection should prove that the system can:

```text
- accept valid bridge-intent preparation
- reject replayed intents
- reject expired intents
- reject unapproved routes
- reject missing HMAC requests
- reject invalid HMAC requests
- reject missing simulation hashes
- reject execution while paused
- return proof logging fields for accepted and rejected flows
```

## Collection structure

Top-level folders:

```text
Core Endpoints
Test Scenarios
```

Scenario folders:

```text
Happy path
Replay attack
Expired intent
Unapproved route
Missing HMAC
Invalid HMAC
Missing simulation hash
Paused bridge
Proof logging
```

## Collection variables

```text
base_url
intent_id
route_id
source_chain_id
destination_chain_id
deadline_unix
nonce
hmac
simulation_hash
operator_address
```

## Core endpoints

```text
GET  /api/bridge/status
POST /api/bridge/intent/prepare
POST /api/bridge/intent/approve
POST /api/bridge/intent/execute
POST /api/bridge/pause
POST /api/bridge/unpause
```

## Automation included

The collection includes collection-level pre-request logic to derive safe defaults when missing, including values like:

```text
deadline_unix
nonce
```

It also includes baseline response checks for every request and scenario-specific tests for:

```text
happy path success
replay rejection
expired deadline rejection
unknown route rejection
missing/invalid HMAC rejection
missing simulation hash rejection
paused bridge rejection
proof logging field presence
```

## Expected behavior

```text
Valid prepare:
- accepts HTTP 200 or 202
- checks for READY_FOR_APPROVAL or compatible status

Valid execute:
- checks for accepted/success semantics such as BridgeIntentAccepted or equivalent

Negative cases:
- expect non-success responses
- expect JSON error content

Proof logging:
- accepted and rejected responses should include proofId, intentId, status, and timestamp-like fields
```

## Safety rules

This chaos suite is staging/proof-only.

It must not:

```text
- move funds
- require private keys
- assume mainnet
- trigger production failover
- activate devices
- move private data
- bypass human or multisig approval
```

## Next integration gate

The next operational gate is to run this collection through Newman inside the SKYGRID Bridge Guard workflow and generate the primary proof artifact:

```text
pnpk-out/skygrid-bridge-preflight-${GITHUB_RUN_ID}.pnpk
```

The `.pnpk` should reference the Newman JSON report as supporting raw evidence.

## Working phrase

**The Postman collection is the raw chaos-evidence suite; the preflight `.pnpk` is the canonical SKYGRID proof packet.**
