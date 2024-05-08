import { WebAuthnService } from '../src/security/WebAuthnService';
import { TotpService } from '../src/security/TotpService';

describe('Aegis Security & Passkeys Engine', () => {
  let webAuthn: WebAuthnService;
  let totp: TotpService;

  beforeEach(() => {
    webAuthn = new WebAuthnService();
    totp = new TotpService();
  });

  test('successfully verifies WebAuthn challenge and consumes it immediately to block replay', () => {
    const challenge = webAuthn.createRegistrationChallenge('usr_akshay_101');
    expect(challenge.challengeBase64).toBeDefined();

    // Valid verification
    const isValid = webAuthn.verifyChallenge(challenge.challengeId, challenge.challengeBase64);
    expect(isValid).toBe(true);

    // Replay attack attempt: must fail because challenge was consumed
    const replayValid = webAuthn.verifyChallenge(challenge.challengeId, challenge.challengeBase64);
    expect(replayValid).toBe(false);
  });

  test('verifies RFC 6238 TOTP codes with clock drift tolerance', () => {
    const secret = totp.generateSecret();
    const now = Date.now();
    const currentStep = Math.floor(now / 1000 / 30);
    const validOtp = totp.computeTotp(secret, currentStep);

    expect(totp.verifyCode(secret, validOtp, now)).toBe(true);
    expect(totp.verifyCode(secret, '000000', now)).toBe(false);
  });
});
