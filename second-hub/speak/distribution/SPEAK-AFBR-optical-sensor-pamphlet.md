# SPEAK
## Optical Sensor Bridge
### A user-controlled optical telemetry path for iPhone and iPad

**Distribution edition - September 2026**

Speak is being extended with a dedicated optical sensor bridge built around the Broadcom AFBR-S10RX021Z / AFBR-S10RX031Z analog receiver and an ESP32-S3 Bluetooth Low Energy bridge.

The design converts optical intensity received over 1 mm plastic optical fiber into calibrated, quality-scored telemetry that Speak can display and - only when explicit user controls and confidence gates allow it - use as a bounded application modifier.

> **Current status:** Engineering architecture approved and implementation planned. This pamphlet describes the production-target design; it does not claim completed hardware validation or commercial deployment.

## How it works

```text
Optical input / 1 mm POF
        |
Broadcom AFBR-S10RX0x1Z receiver
        |
Protected + scaled analog output
        |
ESP32-S3 ADC + calibration
        |
Dedicated BLE GATT telemetry
        |
iPhone / iPad CoreBluetooth
        |
Speak source + confidence gate
        |
Bounded Speak application output
```

## Built for explicit control

Speak's sensor path is fail-closed by design. Optical input has no authority unless the user has turned Speak ON and explicitly selected the source. Frames must be supported, current, in sequence, calibrated, within accepted electrical ranges, and above the configured quality threshold. The app-level volume cap remains authoritative.

If a gate fails, the effective sensor modifier goes to zero. A sensor frame cannot turn Speak on, raise the volume cap, open the microphone, autonomously connect to an unconfirmed peripheral, or trigger external device actions.

## Technical foundation

The AFBR-S10RX021Z / AFBR-S10RX031Z is an analog optical receiver intended for sensing over plastic optical fiber. Broadcom specifies an integrated photodiode and transimpedance amplifier, with output voltage proportional to coupled optical input power.

Key receiver characteristics used by the Speak bridge design:

- 1 mm plastic optical fiber / Versatile Link interface
- Recommended receiver supply: 4.75-5.25 V, nominal 5 V
- Maximum specified output voltage: 4 V
- Photosensitivity spectral range: 300-1100 nm
- Maximum photosensitivity wavelength: 650 nm
- Typical output rise time: 40 ns
- Typical output fall time: 60 ns
- High EMI robustness and temperature-compensated output
- Recommended chassis grounding for the receiver housing

Because the receiver output can exceed an ESP32-S3 ADC-safe range, the bridge includes analog scaling and protection before the ADC.

## What Speak adds

**Source confirmation** - the user chooses the sensor rather than accepting arbitrary nearby BLE peripherals.

**Calibration** - baseline/reference calibration converts protected ADC measurements into bounded optical-level telemetry.

**Quality scoring** - saturation, under-range, continuity, noise and calibration state are carried with each frame.

**Versioned transport** - a dedicated BLE GATT service carries sequence, time, optical level, quality and flags using a versioned packet contract.

**Immediate fail-close** - stale frames, disconnects, malformed packets, invalid calibration and unsupported versions produce zero sensor effect.

**Traceable verification** - the production target includes firmware/software versions, calibration version and gate decisions in reproducible local test receipts.

## Intended integration scope

This bridge provides a general optical telemetry input for Speak experiments, accessibility interfaces, instrumented demonstrations and controlled sensor research. It can support applications where a fast optical detector needs to become a deliberately authorized mobile-app input.

The AFBR receiver measures optical power. The Speak integration does **not** represent this channel as thought detection, neurological evidence, identity, diagnosis, mood, cognition or intent. Any future biological or neurological claim would require an independently validated sensing modality and evidence specific to that claim.

## Production-target acceptance gates

The integration is ready for a production designation only after the ESP32-S3 streams calibrated telemetry; Speak explicitly discovers/selects/connects/disconnects the bridge; live level and quality are visible; stale, invalid and disconnected data fail closed; Speak OFF always forces zero sensor effect; the app volume cap cannot be exceeded; automated firmware/Swift tests pass; and controlled optical hardware-in-loop testing produces reproducible evidence.

## Pilot / engineering conversation

**Project:** Speak Optical Sensor Bridge  
**Repository hub:** `MVPuknowme/MVPuknowme` -> `second-hub/speak`  
**Technical basis:** Broadcom `pub-005792`, AFBR-S10RX021Z / AFBR-S10RX031Z Data Sheet, June 14, 2018.

For evaluation, the recommended first engagement is a controlled bench pilot: AFBR receiver + 1 mm POF + protected ESP32-S3 ADC bridge + BLE telemetry + Speak on iPhone/iPad, followed by calibration, disconnect/fault tests and a reproducible hardware-in-loop acceptance receipt.

---

**Independent integration notice:** Broadcom and product names referenced here belong to their respective owners. This Speak integration is an independent engineering project and this document does not state or imply Broadcom endorsement.