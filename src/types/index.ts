export interface UserAccount {
  id: string;
  email: string;
  passwordHash?: string;
  totpSecret?: string;
  isMfaEnabled: boolean;
  passkeyCredentials: PasskeyCredential[];
  createdAt: string;
}

export interface PasskeyCredential {
  credentialId: string;
  publicKey: string;
  counter: number;
  transports?: string[];
  createdAt: string;
}

export interface WebAuthnChallenge {
  challengeId: string;
  challengeBase64: string;
  userId: string;
  expiresAt: number;
}

export interface SessionToken {
  userId: string;
  scopes: string[];
  issuedAt: number;
  expiresAt: number;
  signature: string;
}
