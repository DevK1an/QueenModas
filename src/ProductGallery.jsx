import { useState } from 'react';

export default function ProductGallery({ product, color }) {
  const [side, setSide] = useState('front');
  const [isHovered, setIsHovered] = useState(false);
  const [backReady, setBackReady] = useState(false);
  const [failedImages, setFailedImages] = useState([]);
  const front = [color.images?.front, product.image].find(
    (src) => src && !failedImages.includes(src),
  );
  const back = color.images?.back;
  const backCrop = color.images?.backCrop;
  const hasBack = Boolean(back && back !== front && !failedImages.includes(back));
  const showingBack = hasBack && backReady && (isHovered || side === 'back');
  const isReference = front === product.image && front !== color.images?.front;

  function handleImageError(src) {
    setFailedImages((current) => [...current, src]);
  }

  return (
    <div className="product-gallery">
      <div
        className="product-image-wrap"
        onPointerEnter={(event) => {
          if (event.pointerType === 'mouse') setIsHovered(true);
        }}
        onPointerLeave={() => setIsHovered(false)}
      >
        {front ? (
          <img
            className={`product-image${showingBack ? ' is-hidden' : ''}`}
            src={front}
            alt={isReference ? product.imageAlt : `${product.name} — ${color.name}, frente`}
            aria-hidden={showingBack}
            loading="lazy"
            onError={() => handleImageError(front)}
          />
        ) : (
          <div className="product-image-placeholder">Foto indisponível</div>
        )}
        {hasBack && backCrop ? (
          <svg
            className={`product-image product-image-back${showingBack ? ' is-visible' : ''}`}
            viewBox={`0 0 ${backCrop.width - backCrop.left} ${backCrop.height}`}
            preserveAspectRatio="xMidYMid meet"
            role="img"
            aria-label={`${product.name} — ${color.name}, verso`}
            aria-hidden={!showingBack}
          >
            <svg width={backCrop.width - backCrop.left} height={backCrop.height} overflow="hidden">
              <image
                href={back}
                x={-backCrop.left}
                width={backCrop.width}
                height={backCrop.height}
                onLoad={() => {
                  setBackReady(true);
                }}
                onError={() => handleImageError(back)}
              />
            </svg>
          </svg>
        ) : hasBack && (
          <img
            className={`product-image product-image-back${showingBack ? ' is-visible' : ''}`}
            src={back}
            alt={`${product.name} — ${color.name}, verso`}
            aria-hidden={!showingBack}
            loading="lazy"
            onLoad={() => setBackReady(true)}
            onError={() => handleImageError(back)}
          />
        )}
      </div>
      <div className="gallery-controls" role="group" aria-label={`Vistas de ${product.name}, ${color.name}`}>
        <button
          type="button"
          aria-pressed={!showingBack}
          disabled={!front}
          onClick={() => setSide('front')}
        >
          Frente
        </button>
        <button
          type="button"
          aria-pressed={showingBack}
          disabled={!hasBack}
          onClick={() => setSide('back')}
        >
          Verso
        </button>
      </div>
      <p className="gallery-caption" aria-live="polite">
        {!front && !showingBack
          ? 'Foto indisponível'
          : showingBack
            ? `Verso · ${color.name}`
            : isReference ? 'Foto de referência' : `Frente · ${color.name}`}
        {!hasBack && <span>Verso ainda não disponível</span>}
      </p>
    </div>
  );
}
