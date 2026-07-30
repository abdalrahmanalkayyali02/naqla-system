import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    root: './',
    environment: 'node',
    include: ['src/**/*.spec.ts', 'test/**/*.e2e-spec.ts'],
  },
  plugins: [
    // Required to support NestJS dependency injection decorators (@Injectable, etc.)
    swc.vite({
      module: { type: 'es6' },
    }),
  ],
});