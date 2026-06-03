# PNPK Standalone Repository Checklist

## Target repository

```text
MVPuknowme/pnpk-spec
```

## Purpose

Create a standalone public repository for PNPK (`.pnpk`) so other programs, developers, and AI agents can learn and implement the format.

PNPK means:

```text
Patrick Newman Postman Kafka Bridge Packet
```

## Origin and credit

PNPK was originated by:

```text
Michael Vincent Patrick / MVPuknowme
```

for the SkyGrid / Aura-Core ecosystem.

## Current scaffold location

This repository already contains the public-ready scaffold under:

```text
pnpk/
```

Files:

```text
pnpk/README.md
pnpk/LICENSE-MIT.md
pnpk/LICENSE-MVPuknowme-NOTICE.md
pnpk/schema/pnpk.schema.json
```

## Recommended repo description

```text
PNPK (.pnpk) open proof-packet format for Postman/Newman/Kafka bridge evidence exchange.
```

## Recommended topics

```text
pnpk
postman
newman
kafka
proof-packet
skygrid
aura-core
sentinel
mvpuknowme
open-source
```

## GitHub CLI creation path

Run from a local clone of this repository:

```bash
cd pnpk
git init
git add .
git commit -m "Initial PNPK public specification"
gh repo create MVPuknowme/pnpk-spec \
  --public \
  --description "PNPK (.pnpk) open proof-packet format for Postman/Newman/Kafka bridge evidence exchange" \
  --source . \
  --remote origin \
  --push
```

## Manual creation path

1. Create a new public GitHub repo named `pnpk-spec` under `MVPuknowme`.
2. Copy the contents of this `pnpk/` folder into the root of the new repo.
3. Ensure the root contains:
   - `README.md`
   - `LICENSE-MIT.md`
   - `LICENSE-MVPuknowme-NOTICE.md`
   - `schema/pnpk.schema.json`
4. Set the repo description and topics listed above.
5. Add a release tag:

```text
v0.1.0-draft
```

## Safety statement

`.pnpk` files are proof packets, not executable payloads.

They must not execute payments, activate devices, move private data, or trigger production failover by themselves.

## License model

```yaml
license_structure:
  base_license: MIT
  attribution_notice: MVPuknowme License Notice
  origin_credit: Michael Vincent Patrick / MVPuknowme
  format: .pnpk
  status: draft_public_spec
```
