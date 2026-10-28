import { spawn } from 'node:child_process';
import { watch } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { imageDirectory, optimizeImage } from './optimize-images.mjs';

// A observação das fotos fica fora do vite.config.js, lido pela hospedagem.
const timers = new Map();
const watcher = watch(imageDirectory, (event, filename) => {
  if (!filename || !/\.png$/i.test(filename)) return;
  const file = path.join(imageDirectory, filename);
  clearTimeout(timers.get(file));
  timers.set(file, setTimeout(() => {
    timers.delete(file);
    optimizeImage(file).catch(error => {
      if (error.code !== 'ENOENT') console.error(error.message);
    });
  }, 200));
});

const require = createRequire(import.meta.url);
const viteDirectory = path.dirname(require.resolve('vite/package.json'));
const vite = spawn(process.execPath, [path.join(viteDirectory, 'bin/vite.js'), ...process.argv.slice(2)], {
  stdio: 'inherit',
});

function closeWatcher() {
  watcher.close();
  for (const timer of timers.values()) clearTimeout(timer);
  timers.clear();
}

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.once(signal, () => {
    closeWatcher();
    vite.kill(signal);
  });
}

vite.once('error', error => {
  closeWatcher();
  console.error(error.message);
  process.exitCode = 1;
});
vite.once('exit', (code, signal) => {
  closeWatcher();
  process.exitCode = code ?? (signal === 'SIGINT' || signal === 'SIGTERM' ? 0 : 1);
});
