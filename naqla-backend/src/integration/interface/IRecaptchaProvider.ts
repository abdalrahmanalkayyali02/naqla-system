// src/integration/interface/IRecaptchaProvider.ts

import { Result } from 'src/common/Result';

export const RECAPTCHA_PROVIDER = Symbol('IRecaptchaProvider');

export interface RecaptchaVerifyOptions {
  /** رمز reCAPTCHA القادم من العميل (Frontend) */
  token: string;
  /** عنوان IP الخاص بالعميل (اختياري لتعزيز الأمان) */
  remoteIp?: string;
  /** الإجراء المحدد (Action) الممرر في reCAPTCHA v3 (مثل 'register' أو 'login') */
  expectedAction?: string;
  /** الحد الأدنى المعين للسكور المسموح به في v3 (افتراضياً 0.5) */
  minimumScore?: number;
}

export interface RecaptchaVerifyResponse {
  isSuccess: boolean;
  score?: number;
  action?: string;
  challengeTimestamp?: string;
  hostname?: string;
  errorCodes?: string[];
}

export interface IRecaptchaProvider {
  /**
   * التحقق من صحة رمز reCAPTCHA مع خوادم Google
   */
  verify(options: RecaptchaVerifyOptions): Promise<Result<RecaptchaVerifyResponse>>;
}