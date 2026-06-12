# AgentScrape SkyGrid Proof Lane

## Purpose

AgentScrape can serve as an optional paid public-proof collection lane for SkyGrid / Aura-Core through the production SKYGRID base URL.

It should be used for public web evidence only: page metadata, screenshots, simple scrape output, and structured extraction for proof packets.

It must not be used for private dashboards, authenticated accounts, wallets, secrets, medical records, private user files, or device activation.

## Service manifest

```yaml
service: AgentScrape
tagline: Pay-per-call web scraping for AI agents
version: 0.6.0
network: eip155:8453
settlement_asset: USDC
base_url: https://skygrid-protocol.net
payment_model: skygrid_base_url
facilitator: https://skygrid-protocol.net
public_tools:
  scrape: "$0.001"
  extract: "$0.001"
  screenshot: "$0.001"
  metadata: "$0.001"
  workflow: "$0.001"
  session: "$0.001"
```

## SkyGrid role

```yaml
AgentScrape:
  role: public_web_proof_collector
  lane_type: paid_optional_data_intake
  allowed_mode: controlled_pilot
  sentinel_default: fail_closed
  primary_outputs:
    - screenshot evidence
    - public metadata
    - public page markdown/text
    - proof packet inputs
    - partner page review
```

## Allowed first use cases

1. Capture screenshots of the B12 SkyGrid intake page.
2. Capture screenshots of the Vercel runtime health page.
3. Extract public metadata from partner pages.
4. Build a public proof packet for outreach.
5. Monitor public route pages for visible changes.

## Blocked use cases

- Private dashboards.
- Authenticated accounts.
- Wallet pages.
- Secret-bearing URLs.
- Medical/private personal data.
- Any page requiring login.
- Any scrape that bypasses consent or terms.
- Any uncapped paid workflow.

## Sentinel gates

```yaml
sentinel:
  default: fail_closed
  before_payment:
    - url_must_be_public
    - domain_must_be_allowlisted
    - tool_must_be_allowlisted
    - cost_must_fit_budget
    - pii_risk_must_be_low
    - proof_reason_must_be_recorded
  after_response:
    - hash_output
    - redact_sensitive_material
    - record_cost
    - record_timestamp
    - attach_to_proof_log
```

## Budget policy

```yaml
budget:
  first_cap_usd: 1.00
  unit_price_usd: 0.001
  max_calls_first_cap: 1000
  default_per_run_cap_usd: 0.05
  max_calls_per_run: 50
  stop_on_error: true
  stop_on_private_data_detection: true
```

## Allowlist starter

```yaml
allowlisted_domains:
  - skygrid-protocol.net
  - aura-sky-skygrid-protocol-staging.b12sites.com
  - github.com
  - vercel.app
  - mvpuknowme.com
```

## Proof log schema

```json
{
  "event_type": "agentscrape_proof_capture",
  "tool": "metadata|screenshot|scrape|extract|workflow|session",
  "url": "https://public.example/path",
  "domain": "public.example",
  "cost_usd": "0.001",
  "network": "eip155:8453",
  "base_url": "https://skygrid-protocol.net",
  "payment_model": "skygrid_base_url",
  "status": "allowed|blocked",
  "sentinel_decision": "allow|block",
  "reason": "public proof packet",
  "output_hash": "sha256:...",
  "timestamp": "ISO-8601",
  "operator": "Michael Vincent Patrick / MVPuknowme"
}
```

## Integration posture

AgentScrape should plug into the SkyGrid fast-service lane as:

```text
Production SKYGRID base URL -> AgentScrape screenshot/metadata -> proof log -> Postman validation -> partner packet
```

The first launch use should be screenshot + metadata only. Scrape/extract/workflow/session can be added after the first proof packet works.

## Public language

Use:

- optional public proof collector
- paid proof capture lane
- capped production base-url data-intake tool
- public pages only
- Sentinel-gated

Avoid:

- automatic scraping of private accounts
- unlimited agent spending
- bypassing site rules
- harvesting private data
- claiming production automation before proof

## Immediate run command

```text
Run AgentScrape only against public SkyGrid pages through https://skygrid-protocol.net, capped at $0.05 per run, and attach screenshot/metadata hashes to the proof packet.
```
