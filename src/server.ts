import express, { Request, Response } from 'express';
import { WebAuthnService } from './security/WebAuthnService';
import { TotpService } from './security/TotpService';

const app = express();
app.use(express.json());

const webAuthn = new WebAuthnService();
const totp = new TotpService();

app.get('/health', (req, res) => res.json({ status: 'UP', service: 'aegis-auth-passkeys' }));

app.post('/api/passkeys/challenge', (req: Request, res: Response) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: 'userId is required' });
  const challenge = webAuthn.createRegistrationChallenge(userId);
  return res.status(201).json(challenge);
});

app.post('/api/passkeys/verify', (req: Request, res: Response) => {
  const { challengeId, clientChallenge } = req.body;
  const valid = webAuthn.verifyChallenge(challengeId, clientChallenge);
  if (!valid) {
    return res.status(401).json({ valid: false, error: 'Challenge invalid, expired, or already consumed (replay prevented)' });
  }
  return res.json({ valid: true, message: 'FIDO2 Passkey authenticated successfully' });
});

app.post('/api/mfa/totp/generate', (req: Request, res: Response) => {
  const secret = totp.generateSecret();
  const currentCode = totp.computeTotp(secret, Math.floor(Date.now() / 1000 / 30));
  return res.json({ secret, currentCode });
});

app.post('/api/mfa/totp/verify', (req: Request, res: Response) => {
  const { secret, code } = req.body;
  const valid = totp.verifyCode(secret, code);
  if (!valid) {
    return res.status(401).json({ valid: false, error: 'Invalid TOTP authenticator code' });
  }
  return res.json({ valid: true, message: 'TOTP 2FA verified successfully' });
});

const PORT = 8087;
app.listen(PORT, () => console.log(`[Aegis Auth] Running on port ${PORT}`));
