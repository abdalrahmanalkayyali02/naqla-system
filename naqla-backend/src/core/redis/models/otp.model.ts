

import * as crypto from 'crypto';
import { OtpPurpose } from 'src/common/enums/OtpPurpose';
import { OtpRedisPayload } from 'src/common/interface/OtpRedisPayload';

export class Otp {
  public userId: string;
  public codeHash: string;
  public purpose: OtpPurpose;
  public attempts: number;
  public maxAttempts: number;
  public createdAt: number;
  public expiresAt: number;

  constructor(payload: OtpRedisPayload) {
    this.userId = payload.userId;
    this.codeHash = payload.codeHash;
    this.purpose = payload.purpose;
    this.attempts = payload.attempts ?? 0;
    this.maxAttempts = payload.maxAttempts ?? 3;
    this.createdAt = payload.createdAt ?? Date.now();
    this.expiresAt = payload.expiresAt;
  }

  // ==========================================
  // REDIS KEY HELPER & SERIALIZATION
  // ==========================================

  /**
   * Constructs a standardized Redis key.
   * Key pattern: `otp:<purpose>:<userId>`
   */
  public static buildKey(userId: string, purpose: OtpPurpose): string {
    return `otp:${purpose.toLowerCase()}:${userId}`;
  }

  /**
   * Restores an Otp instance from a JSON string retrieved from Redis.
   */
  public static fromJson(jsonString: string): Otp | null {
    try {
      const payload: OtpRedisPayload = JSON.parse(jsonString);
      return new Otp(payload);
    } catch {
      return null;
    }
  }

  /**
   * Serializes the model into a JSON string for Redis storage.
   */
  public toJson(): string {
    const payload: OtpRedisPayload = {
      userId: this.userId,
      codeHash: this.codeHash,
      purpose: this.purpose,
      attempts: this.attempts,
      maxAttempts: this.maxAttempts,
      createdAt: this.createdAt,
      expiresAt: this.expiresAt,
    };
    return JSON.stringify(payload);
  }

  // ==========================================
  // STATIC UTILITY (Utility function for hashing)
  // ==========================================

  /**
   * Hashes plain numeric code string using SHA-256 with static domain salt.
   */
  public static hashCode(code: string): string {
    return crypto
      .createHash('sha256')
      .update(`naqla_otp_salt:${code}`)
      .digest('hex');
  }
}