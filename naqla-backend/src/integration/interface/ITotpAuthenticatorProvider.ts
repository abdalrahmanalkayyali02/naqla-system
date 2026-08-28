// src/integration/interface/ITotpAuthenticatorProvider.ts

import { Result } from 'src/common/Result';

export const TOTP_AUTHENTICATOR_PROVIDER = Symbol('ITotpAuthenticatorProvider');

export interface GenerateTotpSecretResponse {
  /** المفتاح السري المولد والمشفر في القاعدة */
  secret: string;
  /** الرابط الخاص بالـ QR Code بتنسيق otpauth:// */
  otpAuthUrl: string;
}

export interface ITotpAuthenticatorProvider {
  /**
   * إنشاء Secret جديد ورابط OTP Auth لتطبيقات Authenticator (Google/Microsoft)
   * @param accountName اسم المستخدم أو البريد (مثل: user@example.com)
   * @param issuer اسم المنظومة (مثل: "Naqla Chess")
   */
  generateSecret(
    accountName: string,
    issuer?: string,
  ): Promise<Result<GenerateTotpSecretResponse>>;

  /**
   * التحقق من كود الـ 6 أرقام القادم من تطبيق Authenticator
   * @param token كود الـ OTP المكون من 6 أرقام
   * @param secret المفتاح السري المخزن للمستخدم
   */
  verifyToken(token: string, secret: string): Promise<Result<boolean>>;

  /**
   * توليد صورة الـ QR Code بصيغة Data URI (Base64) ليعرضها الـ Frontend مباشرة
   * @param otpAuthUrl رابط otpauth:// القادم من generateSecret
   */
  generateQrCodeBase64(otpAuthUrl: string): Promise<Result<string>>;
}