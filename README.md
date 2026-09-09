# ⚡ SpherePay Protocol

<div align="center">
  <img src="public/banner_1920x640.png" alt="SpherePay Banner" width="100%" />
</div>

<p align="center">
  <strong>The Decentralized Autonomous AI Agent Payment Gateway on Unicity Network (L3 Testnet2)</strong>
  <br />
  <em>Instant Micro-settlement, Agent-to-Agent Service Monetization, and Non-Custodial Paywalls.</em>
</p>

<p align="center">
  <a href="https://github.com/sinascorpion/spherepay/actions"><img src="https://img.shields.io/badge/build-passing-brightgreen" alt="Build Status"></a>
  <a href="https://developers.unicity.network"><img src="https://img.shields.io/badge/network-Unicity%20Testnet2-orange" alt="Unicity Testnet2"></a>
  <a href="https://github.com/unicity-sphere/sphere-sdk"><img src="https://img.shields.io/badge/sdk-%40unicitylabs%2Fsphere--sdk%20v0.16.0-blue" alt="Sphere SDK"></a>
  <a href="https://sphere.unicity.network"><img src="https://img.shields.io/badge/protocol-Connect%202.1-red" alt="Connect Protocol"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-green" alt="License"></a>
</p>

---

## 🌟 Overview

In the emerging **Machine Economy**, billions of autonomous AI agents need to discover each other, consume intelligence/tools, and settle economic transactions at machine speed with zero human intervention.

**SpherePay** is an end-to-end autonomous payment gateway and service marketplace built specifically for the Unicity Network. It bridges human developers and autonomous AI agents through:

1. **AI Service Marketplace:** Instant pay-per-call execution for LLM reasoning (DeepSeek-R1), photorealistic generation (FLUX.1), web scrapers, security auditors, and vector memory.
2. **Autonomous Paywall Generator:** Production-ready middleware enabling any API developer or agent creator to protect their endpoints with non-custodial Unicity L3 payment gates.
3. **Autonomous Provider Agent Node:** An independent daemon running with its own keys that listens to L3 Nostr transfers, validates payment proofs, and dispatches encrypted tokens via NIP-17 direct messaging.
4. **Dual Cyberpunk Theme:** Designed with Unicity's official electric orange aesthetic, supporting both **Dark Cyberpunk Obsidian** and **Sunset Light Orange** modes.

---

## 🏛 Architecture

```
                                 [ Client / Consumer Agent ]
                                              │
                                   1. Select Service / API
                                              │
                                              ▼
                             [ Sphere Connect 2.1 Protocol ]
                             (Signed L3 Intent: INTENT_ACTIONS.SEND)
                                              │
                    ┌─────────────────────────┴─────────────────────────┐
                    │                                                   │
                    ▼                                                   ▼
       [ Unicity Consensus Layer ]                        [ Nostr Relay L3 Network ]
       (Proof of Uniqueness & Settlement)                 (Direct Payment Notification)
                    │                                                   │
                    └─────────────────────────┬─────────────────────────┘
                                              │
                                    2. Instant Settlement (< 50ms)
                                              │
                                              ▼
                             [ SpherePay Autonomous Agent Node ]
                             (Human-out-of-the-loop Daemon)
                                              │
                             3. Deliver Encrypted Completion
                                (NIP-17 Encrypted DM)
                                              │
                                              ▼
                                 [ Output / API Key Granted ]
```

---

## 🛠 Deep SDK Integration

SpherePay utilizes the latest Unicity protocol primitives:

- **`@unicitylabs/sphere-sdk` (v0.16.0)**
  - `ConnectClient` with silent auto-connect and persistent session resumption
  - `PostMessageTransport` and `ExtensionTransport` detection
  - `INTENT_ACTIONS.SEND` and `INTENT_ACTIONS.MINT`
  - `WALLET_EVENTS.LOCKED` / `WALLET_EVENTS.UNLOCKED` Graceful Lock handling (Connect 2.1)
  - Window handle reuse via `POPUP_NAME = 'sphere-wallet'` to prevent memory password eviction
- **`@unicitylabs/sphere-ui` (v0.1.44)**

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/sinascorpion/spherepay.git
cd spherepay
npm install
```

### 2. Run Local Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` (or your configured port) and connect your Sphere Wallet.

### 3. Build for Production

```bash
npm run build
```

---

## 📦 Run Autonomous Agent Daemon

To launch the 24/7 background settlement daemon on an agent server or AstridOS:

```bash
npx tsx src/agent/daemon.ts
```

---

## 📄 License

MIT © 2026 [Sina Scorpion](https://github.com/sinascorpion) & Unicity Network Community.
