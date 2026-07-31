import { OtpPurpose } from "../enums/OtpPurpose";

export interface OtpRedisPayload {
  userId: string;
  codeHash: string; // SHA-256 hash of the plain OTP code
  purpose: OtpPurpose;
  attempts: number;
  maxAttempts: number;
  createdAt: number; // Unix timestamp in milliseconds
  expiresAt: number; // Unix timestamp in milliseconds
}