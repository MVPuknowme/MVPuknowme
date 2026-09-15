# Speak AFBR Optical Bridge Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an ESP32-S3-to-CoreBluetooth optical sensor bridge for Speak using Broadcom AFBR-S10RX021Z/AFBR-S10RX031Z receivers, with explicit source selection and fail-closed confidence gating.

**Architecture:** A protected/scaled AFBR VOUT enters the ESP32-S3 ADC. Firmware calibrates and packetizes bounded optical-level/quality telemetry into a dedicated BLE GATT service. A Swift package decodes and validates frames, manages CoreBluetooth, exposes SwiftUI state, and applies a zero-on-failure Speak gate without granting the sensor authority to enable Speak, raise the volume cap, open audio input, or trigger external actions.

**Tech Stack:** ESP32-S3, Arduino/PlatformIO, C++17, BLE GATT, Swift 6, CoreBluetooth, SwiftUI, XCTest/Swift Testing.

**Spec:** `second-hub/speak/docs/superpowers/specs/2026-09-15-speak-afbr-optical-bridge-design.md`

## Global Constraints

- Product location is `second-hub/speak` in `MVPuknowme/MVPuknowme`.
- Keep Speak separate from Jaxon's Aura, Whisper Breaker, and Aura-Core/SKYGRID.
- Sensor semantics are optical intensity only; do not infer thoughts, neurological activity, identity, mood, cognition, diagnosis, intent, or biological origin.
- AFBR receiver supply is nominal 5.0 V; recommended operating range is 4.75–5.25 V.
- AFBR VOUT may reach 4 V; the ESP32-S3 ADC must receive a protected/scaled signal, never direct unbounded VOUT.
- Existing Speak ON/OFF and app-level volume cap remain authoritative.
- Unconfirmed, stale, malformed, uncalibrated, disconnected, saturated, low-quality, unsupported-schema, or out-of-sequence input produces an effective modifier of zero.
- Do not add microphone/audio capture or unrelated device-control capability to the bridge.
- Swift package floor: iOS 17 and macOS 14, Swift tools 6.0.
- Firmware language level: C++17.

---

## File Structure

```text
second-hub/speak/
├── README.md
├── docs/
│   ├── hardware/afbr-esp32s3-wiring.md
│   └── superpowers/
│       ├── specs/2026-09-15-speak-afbr-optical-bridge-design.md
│       └── plans/2026-09-15-speak-afbr-optical-bridge.md
├── firmware/
│   ├── platformio.ini
│   ├── include/SpeakOpticalProtocol.h
│   ├── src/SpeakOpticalProtocol.cpp
│   ├── src/main.cpp
│   └── test/test_protocol/test_main.cpp
└── ios/
    ├── Package.swift
    ├── Sources/SpeakOpticalBridge/
    │   ├── OpticalSensorFrame.swift
    │   ├── OpticalSensorValidator.swift
    │   ├── OpticalSensorCentral.swift
    │   ├── OpticalSensorStore.swift
    │   ├── SpeakSensorGate.swift
    │   ├── OpticalSensorReceiptWriter.swift
    │   └── OpticalSensorPanel.swift
    └── Tests/SpeakOpticalBridgeTests/
        ├── OpticalSensorFrameTests.swift
        ├── OpticalSensorValidatorTests.swift
        └── SpeakSensorGateTests.swift
```

### On-air frame v1

Exactly 20 bytes, little-endian for multi-byte integers:

```text
0      schema_version       UInt8   must equal 1
1      flags                UInt8   bit0 saturation, bit1 under-range,
                                  bit2 calibration-invalid, bit3 discontinuity
2..5   sequence             UInt32
6..9   timestamp_ms         UInt32  bridge uptime milliseconds
10..11 raw_adc              UInt16
12..13 voltage_mv           UInt16  reconstructed receiver VOUT millivolts
14..15 optical_level_q15    UInt16  0...32767 => 0.0...1.0
16..17 quality_q15          UInt16  0...32767 => 0.0...1.0
18..19 calibration_version  UInt16  0 means invalid/unavailable
```

BLE UUIDs:

```text
service       7D6A0001-7E4D-4E2B-9B33-535045414B31
sensor_frame  7D6A0002-7E4D-4E2B-9B33-535045414B31
sensor_config 7D6A0003-7E4D-4E2B-9B33-535045414B31
sensor_status 7D6A0004-7E4D-4E2B-9B33-535045414B31
```

---

### Task 1: Swift frame decoder and package skeleton

**Files:**
- Create: `second-hub/speak/ios/Package.swift`
- Create: `second-hub/speak/ios/Sources/SpeakOpticalBridge/OpticalSensorFrame.swift`
- Create: `second-hub/speak/ios/Tests/SpeakOpticalBridgeTests/OpticalSensorFrameTests.swift`

**Interfaces:**
- Consumes: 20-byte v1 GATT payload defined above.
- Produces: `OpticalSensorFrame.init(data:) throws`, `OpticalSensorFlags`.

- [ ] **Step 1: Create the package manifest and failing decoder tests**

`Package.swift`:

```swift
// swift-tools-version: 6.0
import PackageDescription

let package = Package(
    name: "SpeakOpticalBridge",
    platforms: [.iOS(.v17), .macOS(.v14)],
    products: [.library(name: "SpeakOpticalBridge", targets: ["SpeakOpticalBridge"])],
    targets: [
        .target(name: "SpeakOpticalBridge"),
        .testTarget(name: "SpeakOpticalBridgeTests", dependencies: ["SpeakOpticalBridge"])
    ]
)
```

`OpticalSensorFrameTests.swift`:

```swift
import XCTest
@testable import SpeakOpticalBridge

final class OpticalSensorFrameTests: XCTestCase {
    func testDecodesV1Frame() throws {
        let bytes: [UInt8] = [
            1, 0,
            0x12, 0x04, 0, 0,
            0xB4, 0xDF, 0x02, 0,
            0x9A, 0x0A,
            0x8C, 0x08,
            0xBB, 0x44,
            0x51, 0x78,
            0x03, 0
        ]
        let frame = try OpticalSensorFrame(data: Data(bytes))
        XCTAssertEqual(frame.sequence, 1042)
        XCTAssertEqual(frame.timestampMs, 188_340)
        XCTAssertEqual(frame.rawADC, 2714)
        XCTAssertEqual(frame.voltageMv, 2188)
        XCTAssertEqual(frame.calibrationVersion, 3)
        XCTAssertEqual(frame.opticalLevel, Double(0x44BB) / 32767.0, accuracy: 0.0001)
    }

    func testRejectsWrongLength() {
        XCTAssertThrowsError(try OpticalSensorFrame(data: Data([1, 0])))
    }

    func testRejectsUnsupportedSchema() {
        var bytes = [UInt8](repeating: 0, count: 20)
        bytes[0] = 2
        XCTAssertThrowsError(try OpticalSensorFrame(data: Data(bytes)))
    }
}
```

- [ ] **Step 2: Run the decoder tests and confirm failure**

Run:

```bash
cd second-hub/speak/ios
swift test --filter OpticalSensorFrameTests
```

Expected: compile failure because `OpticalSensorFrame` does not exist.

- [ ] **Step 3: Implement the minimal decoder**

```swift
import Foundation

public struct OpticalSensorFlags: OptionSet, Sendable, Equatable {
    public let rawValue: UInt8
    public init(rawValue: UInt8) { self.rawValue = rawValue }
    public static let saturation = Self(rawValue: 1 << 0)
    public static let underRange = Self(rawValue: 1 << 1)
    public static let calibrationInvalid = Self(rawValue: 1 << 2)
    public static let discontinuity = Self(rawValue: 1 << 3)
}

public enum OpticalSensorFrameError: Error, Equatable {
    case wrongLength(Int)
    case unsupportedSchema(UInt8)
}

public struct OpticalSensorFrame: Sendable, Equatable {
    public static let byteCount = 20
    public let schemaVersion: UInt8
    public let flags: OpticalSensorFlags
    public let sequence: UInt32
    public let timestampMs: UInt32
    public let rawADC: UInt16
    public let voltageMv: UInt16
    public let opticalLevel: Double
    public let quality: Double
    public let calibrationVersion: UInt16

    public init(data: Data) throws {
        let b = [UInt8](data)
        guard b.count == Self.byteCount else { throw OpticalSensorFrameError.wrongLength(b.count) }
        guard b[0] == 1 else { throw OpticalSensorFrameError.unsupportedSchema(b[0]) }
        func u16(_ i: Int) -> UInt16 { UInt16(b[i]) | (UInt16(b[i + 1]) << 8) }
        func u32(_ i: Int) -> UInt32 {
            UInt32(b[i]) | (UInt32(b[i + 1]) << 8) | (UInt32(b[i + 2]) << 16) | (UInt32(b[i + 3]) << 24)
        }
        schemaVersion = b[0]
        flags = OpticalSensorFlags(rawValue: b[1])
        sequence = u32(2)
        timestampMs = u32(6)
        rawADC = u16(10)
        voltageMv = u16(12)
        opticalLevel = min(1, Double(u16(14)) / 32767.0)
        quality = min(1, Double(u16(16)) / 32767.0)
        calibrationVersion = u16(18)
    }
}
```

- [ ] **Step 4: Run all package tests**

Run: `swift test`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add second-hub/speak/ios
git commit -m "feat(speak): add optical sensor frame decoder"
```

---

### Task 2: Fail-closed validator and Speak gate

**Files:**
- Create: `second-hub/speak/ios/Sources/SpeakOpticalBridge/OpticalSensorValidator.swift`
- Create: `second-hub/speak/ios/Sources/SpeakOpticalBridge/SpeakSensorGate.swift`
- Create: `second-hub/speak/ios/Tests/SpeakOpticalBridgeTests/OpticalSensorValidatorTests.swift`
- Create: `second-hub/speak/ios/Tests/SpeakOpticalBridgeTests/SpeakSensorGateTests.swift`

**Interfaces:**
- Consumes: `OpticalSensorFrame`, local receive time, last accepted sequence, Speak user-control state.
- Produces: `OpticalSensorValidation`, `SpeakSensorGate.evaluate(...) -> SpeakSensorDecision`.

- [ ] **Step 1: Write validator tests**

```swift
import XCTest
@testable import SpeakOpticalBridge

final class OpticalSensorValidatorTests: XCTestCase {
    func testRejectsCalibrationVersionZero() throws {
        let frame = try TestFrames.make(calibrationVersion: 0)
        let result = OpticalSensorValidator().validate(frame, receivedAgeMs: 10, lastSequence: nil)
        XCTAssertEqual(result, .rejected(.calibrationInvalid))
    }

    func testRejectsStaleFrame() throws {
        let frame = try TestFrames.make(calibrationVersion: 1)
        let result = OpticalSensorValidator().validate(frame, receivedAgeMs: 1_001, lastSequence: nil)
        XCTAssertEqual(result, .rejected(.stale))
    }

    func testRejectsDuplicateSequence() throws {
        let frame = try TestFrames.make(sequence: 9, calibrationVersion: 1)
        let result = OpticalSensorValidator().validate(frame, receivedAgeMs: 5, lastSequence: 9)
        XCTAssertEqual(result, .rejected(.sequence))
    }
}
```

Add a test helper that builds the same 20-byte layout and always uses schema 1.

- [ ] **Step 2: Run tests and verify compile failure**

Run: `swift test --filter OpticalSensorValidatorTests`

Expected: compile failure for missing validator types.

- [ ] **Step 3: Implement validator with exact defaults**

```swift
public enum OpticalSensorRejection: String, Sendable, Equatable, Codable {
    case stale, sequence, saturation, underRange, calibrationInvalid, discontinuity, lowQuality, voltageRange
}

public enum OpticalSensorValidation: Sendable, Equatable {
    case accepted
    case rejected(OpticalSensorRejection)
}

public struct OpticalSensorValidator: Sendable {
    public let maxAgeMs: UInt64
    public let minimumQuality: Double
    public init(maxAgeMs: UInt64 = 1_000, minimumQuality: Double = 0.70) {
        self.maxAgeMs = maxAgeMs
        self.minimumQuality = minimumQuality
    }

    public func validate(_ frame: OpticalSensorFrame, receivedAgeMs: UInt64, lastSequence: UInt32?) -> OpticalSensorValidation {
        if receivedAgeMs > maxAgeMs { return .rejected(.stale) }
        if let lastSequence, frame.sequence <= lastSequence { return .rejected(.sequence) }
        if frame.flags.contains(.saturation) { return .rejected(.saturation) }
        if frame.flags.contains(.underRange) { return .rejected(.underRange) }
        if frame.flags.contains(.calibrationInvalid) || frame.calibrationVersion == 0 { return .rejected(.calibrationInvalid) }
        if frame.flags.contains(.discontinuity) { return .rejected(.discontinuity) }
        if frame.quality < minimumQuality { return .rejected(.lowQuality) }
        if frame.voltageMv > 4_000 { return .rejected(.voltageRange) }
        return .accepted
    }
}
```

- [ ] **Step 4: Write gate tests**

```swift
func testSpeakOffAlwaysReturnsZero() throws {
    let frame = try TestFrames.make(calibrationVersion: 1)
    let d = SpeakSensorGate.evaluate(frame: frame, validation: .accepted,
        speakEnabled: false, sourceConfirmed: true, requestedOutput: 0.9, volumeCap: 0.8)
    XCTAssertEqual(d.effectiveOutput, 0)
}

func testVolumeCapCannotBeExceeded() throws {
    let frame = try TestFrames.make(opticalQ15: 32767, qualityQ15: 32767, calibrationVersion: 1)
    let d = SpeakSensorGate.evaluate(frame: frame, validation: .accepted,
        speakEnabled: true, sourceConfirmed: true, requestedOutput: 1.0, volumeCap: 0.4)
    XCTAssertEqual(d.effectiveOutput, 0.4, accuracy: 0.0001)
}
```

- [ ] **Step 5: Implement the gate**

```swift
public struct SpeakSensorDecision: Sendable, Equatable {
    public let modifier: Double
    public let effectiveOutput: Double
    public let reason: String
}

public enum SpeakSensorGate {
    public static func evaluate(
        frame: OpticalSensorFrame,
        validation: OpticalSensorValidation,
        speakEnabled: Bool,
        sourceConfirmed: Bool,
        requestedOutput: Double,
        volumeCap: Double
    ) -> SpeakSensorDecision {
        guard speakEnabled else { return .init(modifier: 0, effectiveOutput: 0, reason: "speak_off") }
        guard sourceConfirmed else { return .init(modifier: 0, effectiveOutput: 0, reason: "source_unconfirmed") }
        guard validation == .accepted else { return .init(modifier: 0, effectiveOutput: 0, reason: "sensor_rejected") }
        let modifier = min(max(frame.opticalLevel, 0), 1)
        let cap = min(max(volumeCap, 0), 1)
        let requested = min(max(requestedOutput, 0), 1)
        return .init(modifier: modifier, effectiveOutput: min(requested * modifier, cap), reason: "accepted")
    }
}
```

- [ ] **Step 6: Run the complete Swift test suite and commit**

Run: `swift test`

Expected: PASS.

```bash
git add second-hub/speak/ios
git commit -m "feat(speak): add fail-closed optical sensor gate"
```

---

### Task 3: CoreBluetooth central and observable store

**Files:**
- Create: `second-hub/speak/ios/Sources/SpeakOpticalBridge/OpticalSensorCentral.swift`
- Create: `second-hub/speak/ios/Sources/SpeakOpticalBridge/OpticalSensorStore.swift`

**Interfaces:**
- Consumes: GATT UUIDs and 20-byte `sensor_frame` notifications.
- Produces: explicitly selected peripheral connection; validated latest frame; connection state for SwiftUI.

- [ ] **Step 1: Define stable UUID and connection-state types**

```swift
import CoreBluetooth

public enum SpeakOpticalUUID {
    public static let service = CBUUID(string: "7D6A0001-7E4D-4E2B-9B33-535045414B31")
    public static let frame = CBUUID(string: "7D6A0002-7E4D-4E2B-9B33-535045414B31")
    public static let config = CBUUID(string: "7D6A0003-7E4D-4E2B-9B33-535045414B31")
    public static let status = CBUUID(string: "7D6A0004-7E4D-4E2B-9B33-535045414B31")
}

public enum OpticalConnectionState: Sendable, Equatable {
    case off, scanning, connecting, connected, fault(String)
}
```

- [ ] **Step 2: Implement `OpticalSensorCentral` with an explicit selection boundary**

Required behavior:

```swift
public protocol OpticalSensorCentralDelegate: AnyObject {
    func opticalCentral(_ central: OpticalSensorCentral, discovered id: UUID, name: String?)
    func opticalCentral(_ central: OpticalSensorCentral, stateChanged state: OpticalConnectionState)
    func opticalCentral(_ central: OpticalSensorCentral, received data: Data, from id: UUID)
}
```

`startScanning()` may discover candidates but must not call `connect`. `connect(to:)` must accept only a UUID previously discovered in this session. Discover only `SpeakOpticalUUID.service`; discover the three specified characteristics; enable notifications only for `frame` and `status`. `disconnect()` cancels the connection, clears the selected peripheral, and emits `.off`.

- [ ] **Step 3: Implement `@MainActor OpticalSensorStore`**

Store properties:

```swift
@Published public private(set) var state: OpticalConnectionState = .off
@Published public private(set) var candidates: [UUID: String] = [:]
@Published public private(set) var selectedPeripheral: UUID?
@Published public private(set) var latestFrame: OpticalSensorFrame?
@Published public private(set) var validation: OpticalSensorValidation = .rejected(.stale)
@Published public private(set) var lastFrameReceivedAt: Date?
```

On frame notification: reject data not originating from `selectedPeripheral`; decode; derive receive age from the local `Date` rather than trusting bridge uptime; validate against `lastAcceptedSequence`; update `lastAcceptedSequence` only for `.accepted`. On any disconnect or decode failure, clear `latestFrame` and set rejected/fault state so downstream gating returns zero.

- [ ] **Step 4: Add a protocol seam for deterministic central tests**

Expose scanning/selection/connection through a small `OpticalSensorTransport` protocol and have the real central conform. In tests, a fake transport must prove that discovery does not auto-connect and that frames from non-selected UUIDs are ignored.

- [ ] **Step 5: Run `swift test` and commit**

Expected: PASS, including the two explicit-selection tests.

```bash
git add second-hub/speak/ios
git commit -m "feat(speak): add explicit CoreBluetooth optical source"
```

---

### Task 4: Local receipts and SwiftUI Optical Sensor panel

**Files:**
- Create: `second-hub/speak/ios/Sources/SpeakOpticalBridge/OpticalSensorReceiptWriter.swift`
- Create: `second-hub/speak/ios/Sources/SpeakOpticalBridge/OpticalSensorPanel.swift`

**Interfaces:**
- Consumes: `OpticalSensorStore` state and `SpeakSensorDecision`.
- Produces: local metadata-only receipt and user-facing sensor controls.

- [ ] **Step 1: Implement receipt schema without raw sample history**

```swift
public struct OpticalSensorReceipt: Codable, Sendable {
    public let createdAt: Date
    public let peripheralID: UUID
    public let schemaVersion: UInt8
    public let sequence: UInt32
    public let calibrationVersion: UInt16
    public let opticalLevel: Double
    public let quality: Double
    public let validation: String
    public let speakEnabled: Bool
    public let sourceConfirmed: Bool
    public let effectiveOutput: Double
    public let reason: String
}
```

`OpticalSensorReceiptWriter` writes one JSON object per explicit diagnostic capture. Do not persist BLE packet dumps or continuous raw ADC history by default.

- [ ] **Step 2: Add receipt encoding test**

Assert JSON contains `schemaVersion`, `calibrationVersion`, `validation` and `reason`, and does not contain keys named `rawHistory`, `samples`, `thought`, `identity`, `diagnosis` or `intent`.

- [ ] **Step 3: Implement `OpticalSensorPanel`**

The panel accepts bindings for Speak's authoritative controls rather than owning them:

```swift
public struct OpticalSensorPanel: View {
    @ObservedObject var store: OpticalSensorStore
    @Binding var speakEnabled: Bool
    @Binding var appVolumeCap: Double
    let requestedOutput: Double
}
```

Render source state, candidates, selected source, optical level, quality, calibration version, last-frame age, Scan, Connect, Disconnect and Clear Calibration. Disable Connect until the user taps a discovered source. When `speakEnabled == false`, display `Sensor effect: 0` regardless of telemetry.

- [ ] **Step 4: Run `swift test` and commit**

```bash
git add second-hub/speak/ios
git commit -m "feat(speak): add optical sensor panel and receipts"
```

---

### Task 5: Firmware protocol encoder and calibration math

**Files:**
- Create: `second-hub/speak/firmware/platformio.ini`
- Create: `second-hub/speak/firmware/include/SpeakOpticalProtocol.h`
- Create: `second-hub/speak/firmware/src/SpeakOpticalProtocol.cpp`
- Create: `second-hub/speak/firmware/test/test_protocol/test_main.cpp`

**Interfaces:**
- Consumes: ADC counts, measured ADC pin millivolts, calibration limits and quality inputs.
- Produces: exact 20-byte v1 packet shared with Swift.

- [ ] **Step 1: Add PlatformIO environments**

```ini
[platformio]
default_envs = esp32s3

[env:esp32s3]
platform = espressif32
board = esp32-s3-devkitc-1
framework = arduino
monitor_speed = 115200
build_flags = -std=gnu++17

[env:native]
platform = native
test_framework = unity
build_flags = -std=c++17
```

- [ ] **Step 2: Write failing native golden-vector test**

```cpp
#include <unity.h>
#include "SpeakOpticalProtocol.h"

void test_encode_matches_swift_vector() {
  speak::Frame f{1, 0, 1042, 188340, 2714, 2188, 0x44BB, 0x7851, 3};
  auto bytes = speak::encode(f);
  const uint8_t expected[20] = {
    1,0, 0x12,0x04,0,0, 0xB4,0xDF,0x02,0,
    0x9A,0x0A, 0x8C,0x08, 0xBB,0x44, 0x51,0x78, 0x03,0
  };
  TEST_ASSERT_EQUAL_UINT8_ARRAY(expected, bytes.data(), 20);
}
```

Run: `cd second-hub/speak/firmware && pio test -e native`

Expected: FAIL because protocol code does not exist.

- [ ] **Step 3: Implement the protocol**

Header contract:

```cpp
#pragma once
#include <array>
#include <cstdint>

namespace speak {
struct Frame {
  uint8_t schemaVersion;
  uint8_t flags;
  uint32_t sequence;
  uint32_t timestampMs;
  uint16_t rawAdc;
  uint16_t voltageMv;
  uint16_t opticalLevelQ15;
  uint16_t qualityQ15;
  uint16_t calibrationVersion;
};
std::array<uint8_t, 20> encode(const Frame& frame);
uint16_t clampQ15(float value);
uint16_t reconstructReceiverMv(uint16_t adcPinMv);
}
```

`reconstructReceiverMv()` uses the documented bridge divider assumption of 10 kΩ series from VOUT to ADC and 20 kΩ from ADC to ground: receiver VOUT = ADC pin voltage × 1.5. Clamp the reported value to 4000 mV; if the reconstructed value reaches the 4000 mV ceiling, set the saturation flag in `main.cpp` rather than silently treating it as good data.

- [ ] **Step 4: Add calibration boundary tests**

Verify Q15 clamps below 0 to 0, above 1 to 32767, 0.5 to within one count of 16384, 2000 mV ADC pin reconstructs to 3000 mV receiver VOUT, and 2800 mV reconstructs/clamps to 4000 mV.

- [ ] **Step 5: Run native firmware tests and commit**

Run: `pio test -e native`

Expected: PASS.

```bash
git add second-hub/speak/firmware
git commit -m "feat(speak): add optical BLE frame protocol"
```

---

### Task 6: ESP32-S3 ADC acquisition and BLE GATT server

**Files:**
- Create: `second-hub/speak/firmware/src/main.cpp`
- Create: `second-hub/speak/docs/hardware/afbr-esp32s3-wiring.md`

**Interfaces:**
- Consumes: protected AFBR VOUT on ESP32-S3 ADC GPIO 4.
- Produces: `sensor_frame` notifications using Task 5 encoder; `sensor_status` text status; `sensor_config` calibration commands.

- [ ] **Step 1: Document the hardware boundary before powering the receiver**

The wiring document must state:

```text
AFBR pin 3 VCC -> regulated 5 V within 4.75–5.25 V
AFBR pin 2 GND -> common ground
AFBR pins 5/8 housing -> chassis ground where available
AFBR pin 1 VOUT -> 560 Ω to GND per recommended application circuit
AFBR pin 1 VOUT -> 10 kΩ -> ESP32-S3 GPIO4 ADC node
ESP32-S3 GPIO4 ADC node -> 20 kΩ -> GND
```

Also include Broadcom supply filtering from the recommended circuit: 1 µH in series on VCC with 10 µF, 100 nF and 10 nF bypassing as shown by the data sheet. Record that the divider maps 4.0 V receiver VOUT to approximately 2.67 V at the ADC node. Physical assembly must be verified with a multimeter before attaching GPIO4.

- [ ] **Step 2: Implement ADC sampling and calibration state**

Use `analogReadMilliVolts(4)`. Maintain baseline and reference receiver millivolts. `calibrationVersion == 0` until both are valid and `referenceMv > baselineMv + 50`. Normalize with:

```cpp
level = (receiverMv - baselineMv) / float(referenceMv - baselineMv);
```

Clamp to 0...1. Set under-range when reconstructed receiver voltage is below the calibrated baseline by more than 50 mV and saturation at/above 4000 mV.

- [ ] **Step 3: Implement quality calculation**

Maintain a 16-sample rolling window. Quality begins at 1.0 and subtracts 0.50 for saturation, 0.50 for under-range, 0.40 for invalid calibration, and up to 0.30 proportional to normalized rolling peak-to-peak noise. Clamp to 0...1. This value is transport quality only, not a biological/confidence interpretation.

- [ ] **Step 4: Implement the BLE server**

Use Arduino ESP32 BLE (`BLEDevice.h`). Advertise only the dedicated service UUID. Create frame/config/status characteristics with the exact UUIDs in this plan. Frame supports READ|NOTIFY; config supports READ|WRITE; status supports READ|NOTIFY.

Config command values are exactly:

```text
BASELINE      capture current 32-sample mean as baseline
REFERENCE     capture current 32-sample mean as reference; valid only > baseline + 50 mV
CLEAR         reset calibration and set calibrationVersion to 0
```

Reject any other config string without changing state.

- [ ] **Step 5: Emit frames at 20 Hz only while a BLE client is connected**

Increment `sequence` for each emitted frame, use `millis()` for bridge uptime, and fill all 20 bytes through `speak::encode`. On disconnect, stop notifications. Reconnection does not restore a cleared calibration; valid calibration remains only if firmware stored it explicitly in Preferences with its version.

- [ ] **Step 6: Build firmware and rerun native tests**

Run:

```bash
pio test -e native
pio run -e esp32s3
```

Expected: both exit 0.

- [ ] **Step 7: Commit**

```bash
git add second-hub/speak/firmware second-hub/speak/docs/hardware
git commit -m "feat(speak): stream AFBR optical telemetry over BLE"
```

---

### Task 7: Integration README and hardware-in-loop acceptance procedure

**Files:**
- Create: `second-hub/speak/README.md`

**Interfaces:**
- Consumes: completed Swift package and ESP32-S3 firmware.
- Produces: reproducible build, pairing and acceptance procedure.

- [ ] **Step 1: Document build commands**

README must include:

```bash
cd second-hub/speak/ios
swift test

cd ../firmware
pio test -e native
pio run -e esp32s3
pio run -e esp32s3 -t upload
```

- [ ] **Step 2: Document the user pairing flow**

Exact order: power bridge → open Speak → turn Speak sensor panel on → Scan → tap a discovered `Speak Optical` peripheral → Connect → BASELINE calibration → controlled reference illumination → REFERENCE calibration → observe optical level/quality. Discovery alone must never connect.

- [ ] **Step 3: Document fail-closed HIL checks**

Acceptance sequence:

1. With Speak OFF, illuminate sensor: effective sensor output remains 0.
2. With source unconfirmed, emit valid BLE frames: effective sensor output remains 0.
3. Connect and calibrate: optical level moves monotonically with controlled optical input.
4. Disconnect bridge: latest actionable frame clears immediately and effective output becomes 0.
5. Force saturation near receiver maximum: frame carries saturation flag and Swift rejects it.
6. Clear calibration: calibration version becomes 0 and Swift rejects driving output.
7. Replay duplicate sequence: Swift rejects it.
8. Delay local processing beyond 1000 ms: Swift rejects it as stale.
9. Set app volume cap to 0.40 and request 1.0: effective output never exceeds 0.40.
10. Confirm UI and receipts describe the channel as optical intensity, not mental/biological inference.

- [ ] **Step 4: Run final verification**

```bash
cd second-hub/speak/ios && swift test
cd ../firmware && pio test -e native && pio run -e esp32s3
```

Expected: all commands exit 0 before HIL testing begins.

- [ ] **Step 5: Commit**

```bash
git add second-hub/speak/README.md
git commit -m "docs(speak): add optical bridge build and HIL runbook"
```

---

## Plan Self-Review

- Spec coverage: hardware conditioning, ESP32 acquisition, calibration, BLE transport, explicit source selection, Swift decoding, fail-closed validation, Speak gate, volume cap, UI, receipts, automated tests and HIL acceptance are all assigned to tasks.
- Boundary coverage: no task adds microphone capture, auto-connect, unrelated device control or biological/mental inference.
- Protocol consistency: Swift and C++ use the same 20-byte v1 frame and the same UUIDs.
- Fail-closed consistency: stale/invalid/unconfirmed/disconnected input always resolves to zero effect.
- No production claim is accepted solely from a software test; physical AFBR/ESP32 behavior is verified separately by the HIL procedure.
