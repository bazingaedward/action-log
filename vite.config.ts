import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [dts({ rollupTypes: true })],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'ActionLog',
      fileName: 'index',
    },
    rollupOptions: {
      external: [],
    },
    minify: false,
  },
});
