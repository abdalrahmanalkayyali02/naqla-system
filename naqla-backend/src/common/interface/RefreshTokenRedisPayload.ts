export interface RefreshTokenRedisPayload {
  userId: string;
  tokenHash: string; // SHA-256 hash of the refresh token
  familyId: string;  // UUID for token rotation family tracking
  deviceInfo?: string; // User agent or device ID
  ipAddress?: string;
  createdAt: number; // Unix timestamp (ms)
  expiresAt: number; // Unix timestamp (ms)
}