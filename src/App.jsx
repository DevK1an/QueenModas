import { useMemo, useState } from 'react';
import { products } from './data/products.js';
import ProductGallery from './ProductGallery.jsx';
import { imageSource, preloadColorImages } from './productImages.js';

function Icon({ name, size = 20 }) {
  const paths = {
    bag: (
      <>
        <path d="M5 8h14l1 13H4L5 8Z" />
        <path d="M9 8V6a3 3 0 0 1 6 0v2" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m16 16 4 4" />
      </>
    ),
    close: <path d="m6 6 12 12M18 6 6 18" />,
    plus: <path d="M12 5v14m-7-7h14" />,
    minus: <path d="M5 12h14" />,
    arrow: <path d="M7 17 17 7M7 7h10v10" />,
    whatsapp: (
      <>
        <path d="M20.4 11.7a8.4 8.4 0 0 1-12.4 7.4L3.5 20l.9-4.4a8.4 8.4 0 1 1 16-3.9Z" />
        <path d="M8.2 8.1c.2-.5.4-.5.7-.5h.5c.2 0 .4.1.5.4l.7 1.7c.1.2.1.4 0 .5l-.5.7c-.2.2-.2.4 0 .6.4.7 1 1.3 1.7 1.7.2.1.4.1.6-.1l.7-.8c.2-.2.4-.2.6-.1l1.6.8c.2.1.3.2.3.4 0 .3-.2 1.1-.7 1.5-.5.4-1.1.6-1.8.4-1.8-.5-3.2-1.4-4.3-2.7-1-1.2-1.5-2.4-1.6-3.2-.1-.5.1-1 .4-1.3Z" />
      </>
    ),
    chevron: <path d="m6 9 6 6 6-6" />,
  };

  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
}

function formatPrice(price) {
  if (!Number.isFinite(price)) return 'A consultar';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price);
}

function itemTotal(item) {
  return Number.isFinite(item.price) ? item.price * item.quantity : null;
}

function colorQuantity(items, id, color) {
  return items.reduce(
    (sum, item) => sum + (item.id === id && item.color === color ? item.quantity : 0),
    0,
  );
}

function matchesVariant(item, id, color, size) {
  return item.id === id && item.color === color && item.size === size;
}

function cartQuantityLimit(items, item) {
  if (item.stock == null) return Infinity;
  const otherQuantity = colorQuantity(items, item.id, item.color) - item.quantity;
  return Math.max(1, item.stock - otherQuantity);
}

function ProductCard({ product, items, onAdd }) {
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [previewColor, setPreviewColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [requestedQuantity, setQuantity] = useState(1);
  const displayedColor = previewColor || selectedColor;
  const sizes = selectedColor.sizes || [];
  const needsSize = sizes.length > 0 && !sizes.includes(selectedSize);
  const stock = selectedColor.stock == null
    ? null
    : Math.max(0, selectedColor.stock - colorQuantity(items, product.id, selectedColor.name));
  const quantityLimit = stock ?? Infinity;
  const quantity = Math.min(requestedQuantity, Math.max(1, quantityLimit));

  return (
    <article className="product-card">
      <ProductGallery
        key={displayedColor.name}
        product={product}
        color={displayedColor}
      />
      <div className="product-info">
        <div className="product-heading">
          <div>
            <p className="product-category">{product.category}</p>
            <h3>{product.name}</h3>
          </div>
          <span className="product-price">{formatPrice(product.price)}</span>
        </div>
        <div className="color-row">
          <div className="swatches" aria-label={`Cores de ${product.name}`}>
            {product.colors.map((color) => (
              <button
                key={color.name}
                type="button"
                className={`swatch ${selectedColor.name === color.name ? 'is-selected' : ''}`}
                style={{ '--swatch-color': color.hex }}
                aria-label={`${color.name}, ${color.stock == null ? 'disponibilidade a confirmar' : `${color.stock} unidades disponíveis`}`}
                aria-pressed={selectedColor.name === color.name}
                onPointerEnter={(event) => {
                  if (event.pointerType === 'mouse') {
                    void preloadColorImages(product, color);
                    setPreviewColor(color);
                  }
                }}
                onPointerLeave={() => setPreviewColor(null)}
                onFocus={() => {
                  void preloadColorImages(product, color);
                  setPreviewColor(color);
                }}
                onBlur={() => setPreviewColor(null)}
                onClick={() => {
                  setSelectedColor(color);
                  setPreviewColor(null);
                  setSelectedSize('');
                  setQuantity(1);
                }}
              />
            ))}
          </div>
          <span className="color-name">{displayedColor.name}</span>
        </div>
        <div className="size-row">
          {sizes.length > 0 ? (
            <label className="size-field">
              <span>Tamanho</span>
              <select
                aria-label={`Tamanho de ${product.name}`}
                value={selectedSize}
                onChange={(event) => {
                  setSelectedSize(event.target.value);
                  setQuantity(1);
                }}
              >
                <option value="">Escolha</option>
                {sizes.map((size) => <option key={size} value={size}>{size}</option>)}
              </select>
            </label>
          ) : (
            <span className="size-note">Tamanho a confirmar</span>
          )}
        </div>
        <div className="product-bottom">
          <div className="quantity-control" aria-label="Quantidade">
            <button
              type="button"
              aria-label="Diminuir quantidade"
              disabled={quantity <= 1}
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              <Icon name="minus" size={15} />
            </button>
            <span>{quantity}</span>
            <button
              type="button"
              aria-label="Aumentar quantidade"
              disabled={quantity >= quantityLimit}
              onClick={() => setQuantity(Math.min(quantityLimit, quantity + 1))}
            >
              <Icon name="plus" size={15} />
            </button>
          </div>
          <span className={`stock-note ${stock != null && stock < 3 ? 'is-low' : ''}`}>
            {stock == null ? 'A confirmar' : stock === 0 ? (selectedColor.stock === 0 ? 'Esgotado' : 'Já na seleção') : stock < 3 ? `Só ${stock} no mostruário` : `${stock} disponíveis`}
          </span>
        </div>
        <button
          className="add-button"
          type="button"
          disabled={stock === 0 || needsSize}
          onClick={() => onAdd(product, selectedColor, selectedSize || null, quantity)}
        >
          <span>{stock === 0 ? (selectedColor.stock === 0 ? 'Indisponível' : 'Já na seleção') : needsSize ? 'Selecione o tamanho' : 'Separar pelo WhatsApp'}</span>
          <Icon name="arrow" size={17} />
        </button>
      </div>
    </article>
  );
}

function CartDrawer({ items, onClose, onQuantityChange, onRemove }) {
  const total = items.every((item) => Number.isFinite(item.price))
    ? items.reduce((sum, item) => sum + itemTotal(item), 0)
    : null;

  function sendWhatsAppRequest() {
    const phone = (import.meta.env.VITE_WHATSAPP_NUMBER?.trim() || '5561995166613').replace(/\D/g, '');
    const lines = items.map(
      (item) =>
        `• ${item.name} — ${item.color} — Tamanho ${item.size || 'a confirmar'} — ${item.quantity} un. (${formatPrice(itemTotal(item))})`,
    );
    const message = [
      items.length === 1
        ? 'Oi, queenmodas! Gostaria de pedir para separar este vestido:'
        : 'Oi, queenmodas! Gostaria de pedir para separar estes vestidos:',
      '',
      ...lines,
      '',
      total == null ? 'Total a confirmar pelo WhatsApp.' : `Total das peças: ${formatPrice(total)}`,
      '',
      'Pode me confirmar a disponibilidade?',
    ].join('\n');
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  return (
    <div className="drawer-backdrop" onMouseDown={onClose}>
      <aside
        className="cart-drawer"
        aria-label="Peças para separar"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="drawer-header">
          <div>
            <p className="eyebrow">SEU MOSTRUÁRIO</p>
            <h2>Peças escolhidas</h2>
          </div>
          <button type="button" className="icon-button" aria-label="Fechar" onClick={onClose}>
            <Icon name="close" />
          </button>
        </div>
        {items.length === 0 ? (
          <div className="empty-cart">
            <span className="empty-bag"><Icon name="bag" size={30} /></span>
            <h3>Seu cantinho está vazio</h3>
            <p>Escolha suas peças favoritas e peça para separar pelo WhatsApp.</p>
            <button type="button" className="text-button" onClick={onClose}>
              Explorar peças <Icon name="arrow" size={16} />
            </button>
          </div>
        ) : (
          <>
            <div className="cart-list">
              {items.map((item) => (
                <article className="cart-item" key={JSON.stringify([item.id, item.color, item.size])}>
                  <img
                    src={imageSource(item.image)}
                    alt={item.imageAlt}
                    onError={(event) => {
                      if (event.currentTarget.getAttribute('src') !== item.image) {
                        event.currentTarget.src = item.image;
                      }
                    }}
                  />
                  <div className="cart-item-details">
                    <div className="cart-item-title">
                      <div>
                        <h3>{item.name}</h3>
                        <p>{item.color} · Tamanho {item.size || 'a confirmar'}</p>
                      </div>
                      <button
                        type="button"
                        className="remove-button"
                        aria-label={`Remover ${item.name}, ${item.color}, tamanho ${item.size || 'a confirmar'}`}
                        onClick={() => onRemove(item.id, item.color, item.size)}
                      >
                        <Icon name="close" size={16} />
                      </button>
                    </div>
                    <div className="cart-item-bottom">
                      <div className="quantity-control">
                        <button
                          type="button"
                          aria-label="Diminuir quantidade"
                          disabled={item.quantity <= 1}
                          onClick={() =>
                            onQuantityChange(item.id, item.color, item.size, item.quantity - 1)
                          }
                        >
                          <Icon name="minus" size={14} />
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          type="button"
                          aria-label="Aumentar quantidade"
                          disabled={item.quantity >= cartQuantityLimit(items, item)}
                          onClick={() =>
                            onQuantityChange(item.id, item.color, item.size, item.quantity + 1)
                          }
                        >
                          <Icon name="plus" size={14} />
                        </button>
                      </div>
                      <strong>{formatPrice(itemTotal(item))}</strong>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <div className="drawer-footer">
              <div className="total-row">
                <span>Valor estimado</span>
                <strong>{formatPrice(total)}</strong>
              </div>
              <p>Sem pagamento por aqui. A gente confirma tudo com você no WhatsApp.</p>
              <button
                type="button"
                className="whatsapp-button"
                onClick={sendWhatsAppRequest}
              >
                <Icon name="whatsapp" size={18} />
                Pedir para separar
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

export default function App() {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('destaques');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase('pt-BR');
    const filtered = products.filter((product) =>
      !normalizedSearch ||
      `${product.name} ${product.category} ${product.colors.map((color) => color.name).join(' ')}`
        .toLocaleLowerCase('pt-BR')
        .includes(normalizedSearch),
    );

    if (sortBy !== 'destaques') {
      return filtered.sort((a, b) => {
        const aHasPrice = Number.isFinite(a.price);
        const bHasPrice = Number.isFinite(b.price);
        if (!aHasPrice || !bHasPrice) return Number(bHasPrice) - Number(aHasPrice);
        return sortBy === 'menor-preco' ? a.price - b.price : b.price - a.price;
      });
    }
    return filtered;
  }, [search, sortBy]);

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  function addToCart(product, color, size, quantity) {
    if (color.sizes?.length && !color.sizes.includes(size)) return;
    setCart((current) => {
      const remaining = color.stock == null
        ? Infinity
        : Math.max(0, color.stock - colorQuantity(current, product.id, color.name));
      if (remaining === 0) return current;
      const addedQuantity = Math.min(remaining, quantity);
      const existing = current.find(
        (item) => matchesVariant(item, product.id, color.name, size),
      );
      if (!existing) {
        return [
          ...current,
          {
            ...product,
            image: color.images?.front || product.image,
            imageAlt: color.images?.front
              ? `${product.name} — ${color.name}, frente`
              : product.imageAlt,
            color: color.name,
            size,
            stock: color.stock,
            quantity: addedQuantity,
          },
        ];
      }
      return current.map((item) =>
        matchesVariant(item, product.id, color.name, size)
          ? { ...item, quantity: item.quantity + addedQuantity }
          : item,
      );
    });
    setIsCartOpen(true);
  }

  function changeCartQuantity(id, color, size, quantity) {
    setCart((current) =>
      current.map((item) =>
        matchesVariant(item, id, color, size)
          ? { ...item, quantity: Math.max(1, Math.min(cartQuantityLimit(current, item), quantity)) }
          : item,
      ),
    );
  }

  function removeFromCart(id, color, size) {
    setCart((current) =>
      current.filter((item) => !matchesVariant(item, id, color, size)),
    );
  }

  return (
    <div className="site-shell" id="inicio">
      <header className="site-header">
        <a className="brand" href="#inicio" aria-label="queenmodas, início">
          <span>queen<span className="brand-accent">modas</span></span>
        </a>
        <nav className="main-nav" aria-label="Navegação principal">
          <a className="nav-active" href="#colecao">A coleção</a>
        </nav>
        <button
          type="button"
          className="bag-button"
          aria-label={`Ver peças escolhidas, ${itemCount} itens`}
          onClick={() => setIsCartOpen(true)}
        >
          <span className="bag-label">Minha seleção</span>
          <span className="bag-icon">
            <Icon name="bag" size={19} />
            {itemCount > 0 && <span className="bag-count">{itemCount}</span>}
          </span>
        </button>
      </header>

      <main>
        <section className="collection-section" id="colecao" aria-labelledby="catalog-title">
          <h1 className="catalog-title" id="catalog-title">Roupas</h1>
          <div className="catalog-toolbar">
            <div className="catalog-tools">
              <label className="search-field">
                <Icon name="search" size={17} />
                <input
                  type="search"
                  placeholder="Buscar uma peça..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  aria-label="Buscar peças"
                />
              </label>
              <label className="sort-field">
                <span className="sort-label">Ordenar:</span>
                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                  aria-label="Ordenar produtos"
                >
                  <option value="destaques">Destaques</option>
                  <option value="menor-preco">Menor preço</option>
                  <option value="maior-preco">Maior preço</option>
                </select>
                <Icon name="chevron" size={15} />
              </label>
            </div>
          </div>
          <div className="results-caption">
            <span>{filteredProducts.length} {filteredProducts.length === 1 ? 'peça encontrada' : 'peças para descobrir'}</span>
            <span className="results-detail">
              <span className="desktop-photo-hint">ESCOLHA A COR · PASSE O MOUSE NA FOTO PARA VER O VERSO</span>
              <span className="mobile-photo-hint">TOQUE NA COR · VEJA FRENTE E VERSO</span>
            </span>
          </div>
          {filteredProducts.length > 0 ? (
            <div className="product-grid">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} items={cart} onAdd={addToCart} />
              ))}
            </div>
          ) : (
            <div className="no-results">
              <span>♡</span>
              <h3>Não encontramos essa peça.</h3>
              <p>Tente buscar por outro nome ou cor.</p>
              <button
                type="button"
                className="text-button"
                onClick={() => setSearch('')}
              >
                Ver todas as peças <Icon name="arrow" size={16} />
              </button>
            </div>
          )}
        </section>
      </main>

      <footer className="site-footer">
        <a className="brand footer-brand" href="#inicio" aria-label="queenmodas, início">
          <span>queen<span className="brand-accent">modas</span></span>
        </a>
        <span>© 2026 queenmodas. Todos os direitos reservados.</span>
      </footer>

      {isCartOpen && (
        <CartDrawer
          items={cart}
          onClose={() => setIsCartOpen(false)}
          onQuantityChange={changeCartQuantity}
          onRemove={removeFromCart}
        />
      )}
    </div>
  );
}
