import { defineConfig, mergeConfig } from 'vitest/config';
import vitestBaseConfig from '../../configs/vitest.base.js';

export default mergeConfig(
  vitestBaseConfig,
  defineConfig({
    test: {
      environment: 'node',
    },
  })
); 