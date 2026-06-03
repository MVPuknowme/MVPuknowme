# SkyGrid Sandbox Token Lanes

## Purpose

Document safe test-token lanes for SkyGrid sandbox preflight.

These lanes are for simulated moves, quote testing, route readiness, and proof packet generation only.

## Guardrails

```yaml
real_funds_allowed: false
mainnet_allowed: false
payment_execution: blocked
device_activation: blocked
private_data_movement: blocked
sentinel: fail_closed
```

## Ethereum Sepolia

Alchemy's Sepolia faucet provides free testnet ETH for Sepolia, and its documentation describes Sepolia ETH as useful for testing applications before deploying on mainnet.

Use case in SkyGrid:

- quote simulation
- proof packet route testing
- non-custodial fee-readiness demo
- no real payment execution

## MegaETH Testnet

MegaETH documentation describes MegaETH as a high-performance Ethereum Layer 2 network, and its user guide includes a testnet path for getting ETH on testnet.

Use case in SkyGrid:

- high-throughput sandbox posture tests
- simulated route pressure
- fee-readiness testing
- no mainnet movement

## Solana Devnet

Solana devnet/test SOL should be used only through operator-selected official or trusted devnet tooling.

Use case in SkyGrid:

- sandbox-only test-token simulation
- no real SOL movement
- no custody
- no production payment execution

## Preflight checklist

```yaml
sandbox_token_preflight:
  network:
  faucet_source:
  wallet_type: test_wallet_only
  amount: test_only
  purpose:
  real_funds: false
  mainnet: false
  operator_approval:
  proof_log:
  sentinel_decision: fail_closed_until_ready
```

## Public copy

Use:

> SkyGrid supports sandbox test-token simulations for route readiness and proof validation. No public route executes real payments, moves real funds, activates devices, or performs production failover.

Avoid:

- guaranteed earnings claims
- production payment claims
- mainnet movement claims
- automatic token movement language
