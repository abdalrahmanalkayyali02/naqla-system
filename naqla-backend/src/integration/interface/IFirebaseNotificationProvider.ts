// src/integration/interfaces/IFirebaseNotificationProvider.ts

import { Result } from 'src/common/Result';

export const FIREBASE_NOTIFICATION_PROVIDER = Symbol('IFirebaseNotificationProvider');

export interface PushNotificationPayload {
  title: string;
  body: string;
  imageUrl?: string;
  /** بيانات إضافية مخصصة للـ Mobile App (مثل: { tournamentId: '123', round: '4' }) */
  data?: Record<string, string>;
}

export interface SendToDeviceOptions {
  /** رمز الجهاز المستهدف (FCM Device Token) */
  targetToken: string;
  notification: PushNotificationPayload;
}

export interface SendToTopicOptions {
  /** اسم القناة/الموضوع المستهدف (مثل: 'tournament_123', 'all_arbiters') */
  topic: string;
  notification: PushNotificationPayload;
}

export interface MulticastNotificationOptions {
  /** مصفوفة رموز الأجهزة المستهدفة */
  targetTokens: string[];
  notification: PushNotificationPayload;
}

export interface MulticastNotificationResponse {
  successCount: number;
  failureCount: number;
  /** الرموز التي فشل الإرسال إليها (مثل الأجهزة التي حذفت التطبيق) لتنظيفها من الـ Database */
  invalidTokens: string[];
}

export interface IFirebaseNotificationProvider {
  /**
   * إرسال إشعار لحظي لجهاز محدد عبر الـ FCM Token الخاص به
   */
  sendToDevice(options: SendToDeviceOptions): Promise<Result<string>>;

  /**
   * إرسال إشعار لحظي لمجموعة مستخدمين منضمين لـ Topic محدد (مثل بطولة معينة)
   */
  sendToTopic(options: SendToTopicOptions): Promise<Result<string>>;

  /**
   * إرسال إشعار جماعي لقائمة محددة من الـ Tokens في طلب واحد
   */
  sendMulticast(options: MulticastNotificationOptions): Promise<Result<MulticastNotificationResponse>>;
}