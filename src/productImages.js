// As cópias WebP são geradas antes de iniciar o servidor e antes do build.
export function imageSource(source) {
  return source?.startsWith('/roupas/')
    ? source.replace(/\.png$/i, '.optimized.webp')
    : source;
}

const imageRequests = new Map();

function preloadImage(source, priority) {
  if (!source || typeof window === 'undefined') return Promise.resolve();
  const existing = imageRequests.get(source);
  if (existing) {
    if (priority === 'high') existing.image.fetchPriority = 'high';
    return existing.promise;
  }

  const image = new window.Image();
  image.decoding = 'async';
  image.fetchPriority = priority;
  const promise = new Promise((resolve, reject) => {
    image.onload = async () => {
      if (image.decode) await image.decode().catch(() => {});
      resolve();
    };
    image.onerror = () => {
      imageRequests.delete(source);
      reject(new Error('Foto indisponível'));
    };
  });
  imageRequests.set(source, { image, promise });
  image.src = source;
  return promise;
}

export function preloadColorImages(product, color, priority = 'high') {
  const sources = [color.images?.front || product.image, color.images?.back].filter(Boolean);
  return Promise.allSettled(sources.map(async (original) => {
    const optimized = imageSource(original);
    try {
      await preloadImage(optimized, priority);
    } catch {
      if (optimized !== original) await preloadImage(original, priority);
    }
  }));
}

export function preloadProductImages(product) {
  return Promise.all(product.colors.map(color => preloadColorImages(product, color, 'low')));
}
