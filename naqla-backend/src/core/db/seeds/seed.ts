// src/core/db/seeds/seed.ts
// Run via:  npm run db:seed

import 'dotenv/config';
import { PrismaClient, LanguageDirection } from '../../../../generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import { seedGeography } from './seedGeography';

// ── Prisma v7: must supply the adapter (no url in schema.prisma) ──────────────
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL as string,
});
const prisma = new PrismaClient({ adapter });

// ─────────────────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n🌱 Starting database seed…\n');

  // ══════════════════════════════════════════════════════════════════════════
  // 1. LANGUAGES
  // ══════════════════════════════════════════════════════════════════════════
  console.log('📌 Seeding languages…');

  const enLang = await prisma.language.upsert({
    where: { code: 'en' },
    update: {},
    create: {
      code: 'en',
      nativeName: 'English',
      isDefault: true,
      isActive: true,
      direction: LanguageDirection.LTR,
    },
  });

  const arLang = await prisma.language.upsert({
    where: { code: 'ar' },
    update: {},
    create: {
      code: 'ar',
      nativeName: 'العربية',
      isDefault: false,
      isActive: true,
      direction: LanguageDirection.RTL,
    },
  });

  console.log('  ✅ Languages: en, ar\n');

  // ══════════════════════════════════════════════════════════════════════════
  // 2. TOP-LEVEL ROLES
  // ══════════════════════════════════════════════════════════════════════════
  console.log('📌 Seeding top-level roles…');

  // ── SUPER_ADMIN ──────────────────────────────────────────────────────────
  await prisma.role.upsert({
    where: { code: 'SUPER_ADMIN' },
    update: {},
    create: {
      code: 'SUPER_ADMIN',
      isSystem: true,
      isActive: true,
      translations: {
        create: [
          {
            languageId: enLang.id,
            name: 'Super Admin',
            description: 'Full system access — highest privilege level.',
          },
          {
            languageId: arLang.id,
            name: 'مشرف النظام',
            description: 'صلاحيات كاملة على النظام — أعلى مستوى امتياز.',
          },
        ],
      },
    },
  });

  // ── ORGANIZER ────────────────────────────────────────────────────────────
  await prisma.role.upsert({
    where: { code: 'ORGANIZER' },
    update: {},
    create: {
      code: 'ORGANIZER',
      isSystem: true,
      isActive: true,
      translations: {
        create: [
          {
            languageId: enLang.id,
            name: 'Tournament Organizer',
            description: 'Creates and manages chess tournaments.',
          },
          {
            languageId: arLang.id,
            name: 'منظم البطولة',
            description: 'ينشئ ويدير بطولات الشطرنج.',
          },
        ],
      },
    },
  });

  // ── ARBITER ──────────────────────────────────────────────────────────────
  await prisma.role.upsert({
    where: { code: 'ARBITER' },
    update: {},
    create: {
      code: 'ARBITER',
      isSystem: true,
      isActive: true,
      translations: {
        create: [
          {
            languageId: enLang.id,
            name: 'Arbiter',
            description: 'Official chess arbiter who oversees tournament games.',
          },
          {
            languageId: arLang.id,
            name: 'حكم',
            description: 'حكم شطرنج رسمي يشرف على مباريات البطولة.',
          },
        ],
      },
    },
  });

  console.log('  ✅ Roles: SUPER_ADMIN, ORGANIZER, ARBITER\n');

  // ══════════════════════════════════════════════════════════════════════════
  // 3. PLAYER ROLE HIERARCHY
  // ══════════════════════════════════════════════════════════════════════════
  console.log('📌 Seeding player role hierarchy…');

  // ── Base Parent: PLAYER ──────────────────────────────────────────────────
  const basePlayerRole = await prisma.role.upsert({
    where: { code: 'PLAYER' },
    update: {},
    create: {
      code: 'PLAYER',
      isSystem: true,
      isActive: true,
      translations: {
        create: [
          {
            languageId: enLang.id,
            name: 'Chess Player',
            description: 'Standard chess player profile.',
          },
          {
            languageId: arLang.id,
            name: 'لاعب شطرنج',
            description: 'ملف شخصي للاعب الشطرنج.',
          },
        ],
      },
    },
  });

  // ── Sub-Role: FIDE_PLAYER (child of PLAYER) ──────────────────────────────
  await prisma.role.upsert({
    where: { code: 'FIDE_PLAYER' },
    update: { parentRoleId: basePlayerRole.id },
    create: {
      code: 'FIDE_PLAYER',
      parentRoleId: basePlayerRole.id,
      isSystem: true,
      isActive: true,
      translations: {
        create: [
          {
            languageId: enLang.id,
            name: 'FIDE Player',
            description:
              'Player registered with an official FIDE ID and rating history.',
          },
          {
            languageId: arLang.id,
            name: 'لاعب مصنف دولياً (FIDE)',
            description:
              'لاعب مسجل بمعرف FIDE رسمي وسجل تصنيف دولي.',
          },
        ],
      },
    },
  });

  // ── Sub-Role: NATIONAL_PLAYER (child of PLAYER) ──────────────────────────
  await prisma.role.upsert({
    where: { code: 'NATIONAL_PLAYER' },
    update: { parentRoleId: basePlayerRole.id },
    create: {
      code: 'NATIONAL_PLAYER',
      parentRoleId: basePlayerRole.id,
      isSystem: true,
      isActive: true,
      translations: {
        create: [
          {
            languageId: enLang.id,
            name: 'National Player',
            description:
              'Player registered locally without an official FIDE ID.',
          },
          {
            languageId: arLang.id,
            name: 'لاعب محلي / غير مصنف',
            description:
              'لاعب مسجل محلياً بدون معرف FIDE رسمي.',
          },
        ],
      },
    },
  });

  // ── Sub-Role: UNRATED_PLAYER (child of PLAYER) ───────────────────────────
  await prisma.role.upsert({
    where: { code: 'UNRATED_PLAYER' },
    update: { parentRoleId: basePlayerRole.id },
    create: {
      code: 'UNRATED_PLAYER',
      parentRoleId: basePlayerRole.id,
      isSystem: true,
      isActive: true,
      translations: {
        create: [
          {
            languageId: enLang.id,
            name: 'Unrated Player',
            description:
              'Casual or beginner player without any formal affiliation.',
          },
          {
            languageId: arLang.id,
            name: 'لاعب غير مصنف',
            description:
              'لاعب مبتدئ أو عارض بدون أي انتساب رسمي.',
          },
        ],
      },
    },
  });

  console.log(
    '  ✅ Player hierarchy: PLAYER → FIDE_PLAYER, NATIONAL_PLAYER, UNRATED_PLAYER\n',
  );

  // ══════════════════════════════════════════════════════════════════════════
  // 4. CORE PERMISSIONS
  // ══════════════════════════════════════════════════════════════════════════
  console.log('📌 Seeding core permissions…');

  const permissionDefs = [
    // Users module
    { code: 'USER_VIEW',   module: 'users', en: 'View Users',   ar: 'عرض المستخدمين' },
    { code: 'USER_CREATE', module: 'users', en: 'Create Users',  ar: 'إنشاء المستخدمين' },
    { code: 'USER_UPDATE', module: 'users', en: 'Update Users',  ar: 'تعديل المستخدمين' },
    { code: 'USER_DELETE', module: 'users', en: 'Delete Users',  ar: 'حذف المستخدمين' },
    { code: 'USER_BAN',    module: 'users', en: 'Ban Users',     ar: 'حظر المستخدمين' },

    // Tournaments module
    { code: 'TOURNAMENT_VIEW',   module: 'tournaments', en: 'View Tournaments',   ar: 'عرض البطولات' },
    { code: 'TOURNAMENT_CREATE', module: 'tournaments', en: 'Create Tournaments', ar: 'إنشاء البطولات' },
    { code: 'TOURNAMENT_UPDATE', module: 'tournaments', en: 'Update Tournaments', ar: 'تعديل البطولات' },
    { code: 'TOURNAMENT_DELETE', module: 'tournaments', en: 'Delete Tournaments', ar: 'حذف البطولات' },

    // Ratings module
    { code: 'RATING_VIEW',   module: 'ratings', en: 'View Ratings',   ar: 'عرض التصنيفات' },
    { code: 'RATING_ADJUST', module: 'ratings', en: 'Adjust Ratings', ar: 'تعديل التصنيفات' },

    // Roles & Permissions
    { code: 'ROLE_MANAGE',       module: 'rbac', en: 'Manage Roles',       ar: 'إدارة الأدوار' },
    { code: 'PERMISSION_MANAGE', module: 'rbac', en: 'Manage Permissions', ar: 'إدارة الصلاحيات' },
  ];

  for (const p of permissionDefs) {
    await prisma.permission.upsert({
      where: { code: p.code },
      update: {},
      create: {
        code: p.code,
        module: p.module,
        isActive: true,
        translations: {
          create: [
            { languageId: enLang.id, name: p.en },
            { languageId: arLang.id, name: p.ar },
          ],
        },
      },
    });
  }

  console.log(`  ✅ ${permissionDefs.length} permissions seeded\n`);

  await seedGeography(prisma, enLang.id, arLang.id);

  // ══════════════════════════════════════════════════════════════════════════
  // Done
  // ══════════════════════════════════════════════════════════════════════════
  console.log('✅ Database seeded successfully!\n');
}

// ─────────────────────────────────────────────────────────────────────────────
main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
