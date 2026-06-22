# SKYGRID CCTV Connector Inspiration

## Core idea

Build Ring and CCTV connectors as **SKYGRID proof connectors**, not surveillance pipes.

The connector should answer:

```text
What camera/source exists?
Is it reachable?
What event happened?
What route is safe?
What proof packet was generated?
Who authorized access?
Was video moved, blocked, or only indexed?
```

## Protocol language

```text
SKYGRID CCTV Connector =
an authorized camera-network preflight adapter that checks camera reachability,
route health, event metadata, and emergency availability, then emits a .pnpk
proof packet without default video extraction.
```

## Connector priority

### 1. ONVIF / RTSP first

Start with ONVIF and RTSP because they are broadly used across IP camera systems and facility networks.

Initial goal:

```text
Discover source → verify reachability → check stream/event metadata →
record route health → emit preflight .pnpk proof packet.
```

This should remain metadata-first. The first version should not default to pulling, storing, or mirroring live video.

### 2. Ring consent intake second

Ring should be handled as a consent-only connector.

```text
Ring Connector =
owner-consented alert/clip intake and emergency proof reference only,
not background scraping, not covert live access, not mass surveillance.
```

Supported first-version behavior:

```text
- user-authorized clip import
- user-submitted event timestamp
- camera/device label
- location/site label
- emergency availability proof
- .pnpk packet generation
- no hidden feed access
- no private credentials stored in repo
```

### 3. Enterprise CCTV connectors later

Possible future adapters:

```text
- Axis / VAPIX
- Milestone
- Genetec
- Avigilon
- Verkada
- Eagle Eye
- Hikvision / Dahua only where legally and securely approved
```

## SKYGRID architecture

```text
[Ring / ONVIF / CCTV Source]
        ↓
[Connector Adapter]
        ↓
[Consent + Role Gate]
        ↓
[Micro-ping / Route Preflight]
        ↓
[Sentinel Decision]
        ↓
[Emergency Data On-Ramp]
        ↓
[preflight .pnpk proof packet]
        ↓
[Dashboard / First Responder / Facility Continuity View]
```

## Example proof shape

```json
{
  "connector_type": "cctv_onvif",
  "source_id": "facility-camera-north-door",
  "site_id": "clinic-oregon-001",
  "event_type": "motion_or_alert",
  "observed_at": "2026-06-22T00:00:00Z",
  "camera_reachable": true,
  "stream_available": true,
  "clip_moved": false,
  "live_feed_opened": false,
  "authorization": {
    "authorized": true,
    "scope": "emergency_metadata_only",
    "approved_by": "site_admin"
  },
  "sentinel": {
    "decision": "preflight_only",
    "reason": "route verified; no video transfer required"
  },
  "execution": {
    "executable": false,
    "payments_executed": false,
    "private_data_moved": false,
    "production_failover_triggered": false
  }
}
```

## Safety boundary

Do not build this as:

```text
- hidden camera access
- credential scraping
- police-style mass search
- facial recognition by default
- license plate tracking by default
- live-feed mirroring by default
- Ring account scraping
- unapproved medical/facility surveillance
```

Build it as:

```text
- authorized facility continuity connector
- route-health and availability proof
- emergency access audit trail
- minimum-necessary evidence routing
- .pnpk proof packet generator
- fail-closed Sentinel decision layer
```

## Recommended repo modules

```text
connectors/onvif/
connectors/rtsp/
connectors/ring-consent-intake/
connectors/cctv-common/
schemas/skygrid-cctv-preflight.schema.json
pnpk/examples/skygrid-cctv-preflight.pnpk
postman/skygrid-cctv-connector.collection.json
```

## Working phrase

**SKYGRID CCTV connectors verify emergency camera/source availability and route safety, then emit preflight `.pnpk` proof packets. They do not create unauthorized surveillance access.**
