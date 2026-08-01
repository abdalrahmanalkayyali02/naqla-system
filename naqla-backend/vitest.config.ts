import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    root: './',
    environment: 'node',
    include: ['src/**/*.spec.ts', 'test/**/*.e2e-spec.ts'],
  },
  resolve: {
    alias: {
      src: '/home/fedora/projects/closeSource/naqla-system/naqla-backend/src',
      generated: '/home/fedora/projects/closeSource/naqla-system/naqla-backend/generated'
    }
  },
  plugins: [
    // Required to support NestJS dependency injection decorators (@Injectable, etc.)
    swc.vite({
      module: { type: 'es6' },
    }),
  ],
});