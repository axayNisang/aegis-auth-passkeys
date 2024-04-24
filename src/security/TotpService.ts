import crypto from 'crypto';

export class TotpService {
  /**
   * RFC 6238 TOTP verification (30 second time-step HMAC-SHA1)
   */
  public generateSecret(): string {
    return crypto.randomBytes(20).toString('hex');
  }

  public computeTotp(secretHex: string, timeStep: number): string {
    const timeBuffer = Buffer.alloc(8);
    timeBuffer.writeBigInt64BE(BigInt(timeStep));

    const hmac = crypto.createHmac('sha1', Buffer.from(secretHex, 'hex'));
    hmac.update(timeBuffer);
    const digest = hmac.digest();

    const offset = digest[digest.length - 1] & 0x0f;
    const binary = ((digest[offset] & 0x7f) << 24) |
                   ((digest[offset + 1] & 0xff) << 16) |
                   ((digest[offset + 2] & 0xff) << 8) |
                   (digest[offset + 3] & 0xff);

    const otp = binary % 1000000;
    return otp.toString().padStart(6, '0');
  }

  public verifyCode(secretHex: string, candidateCode: string, timestampMs: number = Date.now()): boolean {
    const currentTimeStep = Math.floor(timestampMs / 1000 / 30);
    // Support +-1 time step tolerance for slight clock drift
    for (let step = currentTimeStep - 1; step <= currentTimeStep + 1; step++) {
      if (this.computeTotp(secretHex, step) === candidateCode) {
        return true;
      }
    }
    return false;
  }
}
