import crypto from 'crypto';
import { PasskeyCredential, WebAuthnChallenge } from '../types';

export class WebAuthnService {
  private activeChallenges: Map<string, WebAuthnChallenge> = new Map();

  public createRegistrationChallenge(userId: string): WebAuthnChallenge {
    const rawChallenge = crypto.randomBytes(32).toString('base64url');
    const challenge: WebAuthnChallenge = {
      challengeId: `ch_${crypto.randomBytes(8).toString('hex')}`,
      challengeBase64: rawChallenge,
      userId,
      expiresAt: Date.now() + 5 * 60 * 1000 // 5 minute TTL
    };

    this.activeChallenges.set(challenge.challengeId, challenge);
    return challenge;
  }

  public verifyChallenge(challengeId: string, clientChallenge: string): boolean {
    const stored = this.activeChallenges.get(challengeId);
    if (!stored) return false;

    // Challenge expiry check
    if (Date.now() > stored.expiresAt) {
      this.activeChallenges.delete(challengeId);
      return false;
    }

    const matches = stored.challengeBase64 === clientChallenge;
    // One-time use: delete challenge to prevent replay attacks
    this.activeChallenges.delete(challengeId);
    return matches;
  }
}
