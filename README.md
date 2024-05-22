# Aegis — Identity & Passkeys Authentication Service 🛡️

[![CI Pipeline](https://github.com/axayNisang/aegis-auth-passkeys/actions/workflows/ci.yml/badge.svg)](https://github.com/axayNisang/aegis-auth-passkeys/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![FIDO2 WebAuthn](https://img.shields.io/badge/Standard-FIDO2%20%7C%20WebAuthn-brightgreen.svg)](https://fidoalliance.org)

**Aegis** is a modern, passwordless identity and access management (IAM) microservice implementing FIDO2/WebAuthn passkeys (FaceID, TouchID, YubiKey), RFC-6238 TOTP multi-factor authentication, and tamper-resistant token session rotation.

---

## 🏛 System Architecture & Auth Flow

```
                      Client (Browser / Mobile)
                                  │
                                  ▼
               +--------------------------------------+
               |    WebAuthn Challenge Dispatcher    |
               |     (32-Byte Cryptographic Nonce)    |
               +--------------------------------------+
                                  │
                                  ▼ [Signed by Authenticator Private Key]
               +--------------------------------------+
               |     Challenge & Nonce Verifier       |
               |      (Replay Attack Protection)      |
               +--------------------------------------+
                                  │
                                  ▼
               +--------------------------------------+
               |       MFA Gate (RFC-6238 TOTP)       |
               +--------------------------------------+
                                  │
                                  ▼
               +--------------------------------------+
               |   Cryptographic Token Session Engine |
               +--------------------------------------+
```

---

## 🔐 Key Security Principles

- **Passwordless FIDO2 / WebAuthn**: Phishing-resistant authentication relying on asymmetric cryptography (biometric authenticators, security keys).
- **Anti-Replay Challenge Invalidation**: Challenges are single-use cryptographically bound nonces with strict 5-minute TTL expirations.
- **RFC-6238 Time-Based OTP (TOTP)**: Algorithmic standard compatibility with Google Authenticator, 1Password, and Authy with drift window protection.

---

## 🧪 Testing

```bash
npm install
npm test
```

---

## 📄 License
MIT License. Created by [Akshay Nisang](https://github.com/axayNisang).
