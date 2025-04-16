import { defineConfig, mergeConfig } from 'vitest/config';
import vitestBaseConfig from '../../configs/vitest.base.js';
import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
  mergeConfig(
    vitestBaseConfig,
    defineConfig({
      test: {
        environment: 'jsdom',
        setupFiles: ['./src/setupTests.ts'],
      },
    })
  )
);
