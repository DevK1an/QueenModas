import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { imageDirectory, optimizeImage } from './scripts/optimize-images.mjs';

function watchProductImages() {
  return {
    name: 'watch-product-images',
    configureServer(server) {
      const timers = new Map();
      function handleChange(file) {
        if (path.dirname(file) !== path.resolve(imageDirectory) || !/\.png$/i.test(file)) return;
        clearTimeout(timers.get(file));
        timers.set(file, setTimeout(() => {
          timers.delete(file);
          optimizeImage(file).catch(error => server.config.logger.error(error.message));
        }, 200));
      }
      server.watcher.on('add', handleChange).on('change', handleChange);
      server.httpServer?.once('close', () => {
        for (const timer of timers.values()) clearTimeout(timer);
        server.watcher.off('add', handleChange).off('change', handleChange);
      });
    },
  };
}

export default defineConfig({
  plugins: [watchProductImages(), react()],
});
