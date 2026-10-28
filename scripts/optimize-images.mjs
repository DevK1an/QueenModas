import { readdir, rename, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import sharp from 'sharp';

export const imageDirectory = fileURLToPath(new URL('../public/roupas/', import.meta.url));
const jobs = new Map();

export function optimizeImage(source) {
  if (jobs.has(source)) return jobs.get(source);
  const job = (async () => {
    const destination = source.replace(/\.png$/i, '.optimized.webp');
    const original = await stat(source);
    const existing = await stat(destination).catch(() => null);
    if (!existing || existing.mtimeMs < original.mtimeMs) {
      const temporary = `${destination}.tmp`;
      await sharp(source).webp({ quality: 85, effort: 5 }).toFile(temporary);
      await rename(temporary, destination);
    }
    return { original: original.size, optimized: (await stat(destination)).size };
  })().finally(() => jobs.delete(source));
  jobs.set(source, job);
  return job;
}

export async function optimizeImages() {
  const files = (await readdir(imageDirectory)).filter(file => /\.png$/i.test(file));
  let original = 0;
  let optimized = 0;
  for (const file of files) {
    const result = await optimizeImage(path.join(imageDirectory, file));
    original += result.original;
    optimized += result.optimized;
  }
  if (original > 0) {
    console.log(`Fotos PNG: ${files.length} versões WebP, ${(original / 1024 / 1024).toFixed(2)} MB → ${(optimized / 1024 / 1024).toFixed(2)} MB (${Math.round((1 - optimized / original) * 100)}% menores).`);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await optimizeImages();
}
