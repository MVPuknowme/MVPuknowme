# Speak — Broadcom AFBR-S10RX0x1Z Optical Sensor Bridge Design

**Date:** 2026-09-15  
**Status:** Approved  
**Repository:** `MVPuknowme/MVPuknowme`  
**Hub:** `second-hub/speak`

## Objective

Add a user-selected optical sensor input to Speak using the Broadcom AFBR-S10RX021Z or AFBR-S10RX031Z receiver and an ESP32-S3 BLE bridge.

The Broadcom receiver is treated strictly as an optical-power sensor. Speak must not label measurements as thoughts, neurological activity, identity, mood, cognition, intent, or any biological signal unless a separate validated sensing modality establishes that claim.

## Architecture

```text
1 mm POF / optical stimulus
        |
AFBR-S10RX021Z / AFBR-S10RX031Z
        |
Broadcom recommended supply filtering + output load
        |
ADC protection / scaling
        |
ESP32-S3 ADC
        |
calibration + bounded quality extraction
        |
BLE GATT notifications
        |
iPhone/iPad CoreBluetooth
        |
Speak OpticalSensorSource
        |
confidence/source gate
        |
Speak bounded output envelope
```

## Receiver interface

Use the Broadcom-defined electrical interface:

- Pin 1: VOUT
- Pin 2: GND
- Pin 3: VCC
- Pin 4: N.C.
- Pins 5 and 8: housing; recommended to chassis ground
- Nominal receiver supply: 5.0 V
- Recommended operating supply: 4.75–5.25 V
- Maximum specified output voltage: 4 V
- Recommended application circuit uses supply filtering and a 560 Ω output load.

Because the ESP32-S3 ADC domain is below the receiver's possible VOUT, the bridge must include input scaling/protection. Firmware must never assume raw VOUT is safe for a 3.3 V ADC.

## Signal semantics

The channel represents **optical intensity**. The receiver's documented photosensitivity spectral range is 300–1100 nm, with maximum photosensitivity at 650 nm. Typical receiver rise/fall times are 40 ns/60 ns; the BLE/application layer is therefore the telemetry-rate limiter for this integration.

## ESP32-S3 firmware

The bridge shall:

1. sample protected/scaled VOUT;
2. convert ADC counts to normalized optical intensity using versioned calibration coefficients;
3. maintain monotonic timestamps and sequence numbers;
4. compute saturation, under-range, continuity, local-noise and calibration-valid quality state;
5. expose a dedicated Speak BLE service only after explicit connection;
6. expose no microphone, audio capture, device-control or unrelated sensor capability.

### BLE GATT contract

Dedicated service with:

- `sensor_frame` — notify/read
- `sensor_config` — read/write
- `sensor_status` — notify/read

Canonical debug/receipt frame:

```json
{
  "schema_version": 1,
  "sequence": 1042,
  "timestamp_ms": 188340,
  "raw_adc": 2714,
  "voltage_mv": 2188,
  "optical_level": 0.537,
  "quality": 0.94,
  "flags": []
}
```

The on-air representation may use fixed-width binary fields.

## Speak/CoreBluetooth components

- `OpticalSensorCentral` — scan/connect/disconnect/GATT lifecycle.
- `OpticalSensorFrame` — versioned decoded model.
- `OpticalSensorValidator` — schema, freshness, sequence, range and quality checks.
- `OpticalSensorStore` — `@MainActor` observable state for SwiftUI.
- `SpeakSensorGate` — converts a validated frame into a bounded modifier proposal.
- `OpticalSensorReceiptWriter` — optional local diagnostic receipts without raw history by default.

Speak requires explicit user selection/confirmation of the BLE source.

## Confidence and control gating

Sensor influence is allowed only when:

```text
Speak switch ON
AND source explicitly selected
AND BLE connection is the expected peripheral
AND schema supported
AND frame fresh
AND sequence valid
AND calibration valid
AND quality >= configured minimum
AND value within accepted range
AND requested output <= app-level volume cap
```

Failure of any gate forces the effective modifier to zero.

The sensor cannot turn Speak ON, raise the volume cap, open a microphone, autonomously connect to an unconfirmed peripheral, trigger external device actions, or infer identity, mental state, thought content, diagnosis or intent. Turning Speak OFF immediately forces the sensor contribution to zero.

## SwiftUI behavior

Add an Optical Sensor panel showing source state, selected peripheral, live optical level, quality/confidence, calibration state, last-frame age, Disconnect, and Clear Calibration. Existing Speak ON/OFF and volume controls remain authoritative.

## Calibration

1. User selects the sensor.
2. Collect a dark/baseline interval.
3. Collect a known illuminated/reference interval where practical.
4. Derive bounded offset/scale coefficients.
5. Store calibration with sensor identity and version.
6. Invalidate when hardware identity or calibration schema changes.

Uncalibrated data may be displayed as raw telemetry but cannot drive a Speak modifier.

## Fail-closed errors

Reject unknown schema, malformed packets, duplicate/backward sequence, stale frames, disconnects, ADC saturation, calibration mismatch, impossible voltage/range, inadequate quality and unsupported firmware.

UI faults identify the rejected gate without turning a sensor anomaly into a biological interpretation.

## Testing

Firmware: ADC conversion, calibration bounds, saturation/under-range, packet golden vectors, monotonic sequence/timestamps and reconnect behavior.

Swift: packet decoding, unsupported schema, stale/duplicate/out-of-order frames, quality thresholds, Speak OFF, unconfirmed source, invalid calibration, volume cap and disconnect fail-close.

Hardware-in-loop: controlled optical source verifies baseline stability, level monotonicity, clipping, BLE continuity, disconnect fail-close and calibration persistence/version invalidation.

## Product boundary

This implementation lives in `second-hub/speak`. Keep it separate from Jaxon's Aura, Whisper Breaker and Aura-Core/SKYGRID.

## Acceptance criteria

1. ESP32-S3 streams calibrated optical telemetry over the dedicated BLE service.
2. Speak explicitly discovers, selects, connects to and disconnects the bridge.
3. Live optical level and quality are visible.
4. Invalid, stale or disconnected data fail closed.
5. Speak OFF always produces zero sensor effect.
6. App-level volume cap is never exceeded.
7. Sensor readings are not represented as thought, cognition, identity, diagnosis or biological evidence.
8. Firmware and Swift automated tests pass.
9. Hardware-in-loop testing produces a reproducible receipt identifying firmware, schema and calibration versions plus pass/fail gates.
