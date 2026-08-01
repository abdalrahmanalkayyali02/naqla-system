// src/integration/interfaces/IFileStorageProvider.ts

import { Result } from 'src/common/Result';

export const FILE_STORAGE_PROVIDER = Symbol('IFileStorageProvider');

export interface UploadFileOptions {
  /** محتوى الملف كـ Buffer أو Stream */
  file: Buffer;
  /** اسم الملف مع الـ Extension (مثل: avatar.jpg) */
  filename: string;
  /** نوع الـ MIME type (مثل: image/jpeg, application/pdf) */
  mimeType: string;
  /** المجلد المستهدف داخل السيرفر/السحابة (مثل: 'avatars', 'tournaments/pgn') */
  folder?: string;
  /** إمكانية الوصول للملف (عامة public أو خاصة private) */
  isPublic?: boolean;
}

export interface UploadFileResponse {
  /** معرف الملف أو مساره النسبي المخزن */
  fileKey: string;
  /** الرابط الكامل للوصول للملف (Public URL) */
  url: string;
  /** حجم الملف بالـ Bytes */
  sizeInBytes: number;
  /** نوع الـ MIME type للملف */
  mimeType: string;
}

export interface IFileStorageProvider {
  /**
   * رفع ملف جديد إلى وسيط التخزين (Local Disk, AWS S3, Cloudinary, etc.)
   */
  upload(options: UploadFileOptions): Promise<Result<UploadFileResponse>>;

  /**
   * حذف ملف مخزن عبر الـ fileKey الخاص به
   */
  delete(fileKey: string): Promise<Result<boolean>>;

  /**
   * توليد رابط وصول مؤقت ومحمي للملفات الخاصة (Presigned Signed URL)
   */
  getSignedUrl(fileKey: string, expiresInSeconds?: number): Promise<Result<string>>;
}