import { useMemo, useState } from 'react';
import { categories, products } from './data/products.js';

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
    heart: (
      <path d="M20.8 8.6c0 4.1-8.8 10-8.8 10s-8.8-5.9-8.8-10A4.6 4.6 0 0 1 12 6.4a4.6 4.6 0 0 1 8.8 2.2Z" />
    ),
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
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price);
}

function ProductCard({ product, onAdd }) {
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [quantity, setQuantity] = useState(1);
  const stock = selectedColor.stock;

  return (
    <article className="product-card">
      <div className="product-image-wrap">
        <img
          className="product-image"
          src={product.image}
          alt={product.imageAlt}
          loading="lazy"
        />
        {product.tag && <span className="product-tag">{product.tag}</span>}
        <button
          type="button"
          className="favorite-button"
          aria-label={`Adicionar ${product.name} aos favoritos`}
          onClick={(event) => event.currentTarget.classList.toggle('is-favorite')}
        >
          <Icon name="heart" size={18} />
        </button>
      </div>
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
                aria-label={`${color.name}, ${color.stock} unidades disponíveis`}
                aria-pressed={selectedColor.name === color.name}
                onClick={() => {
                  setSelectedColor(color);
                  setQuantity(1);
                }}
              />
            ))}
          </div>
          <span className="color-name">{selectedColor.name}</span>
        </div>
        <div className="product-bottom">
          <div className="quantity-control" aria-label="Quantidade">
            <button
              type="button"
              aria-label="Diminuir quantidade"
              disabled={quantity <= 1}
              onClick={() => setQuantity((value) => Math.max(1, value - 1))}
            >
              <Icon name="minus" size={15} />
            </button>
            <span>{quantity}</span>
            <button
              type="button"
              aria-label="Aumentar quantidade"
              disabled={quantity >= stock}
              onClick={() => setQuantity((value) => Math.min(stock, value + 1))}
            >
              <Icon name="plus" size={15} />
            </button>
          </div>
          <span className={`stock-note ${stock < 3 ? 'is-low' : ''}`}>
            {stock < 3 ? `Só ${stock} no mostruário` : `${stock} disponíveis`}
          </span>
        </div>
        <button
          className="add-button"
          type="button"
          onClick={() => onAdd(product, selectedColor, quantity)}
        >
          <span>Separar pelo WhatsApp</span>
          <Icon name="arrow" size={17} />
        </button>
      </div>
    </article>
  );
}

function CartDrawer({ items, onClose, onQuantityChange, onRemove }) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  function sendWhatsAppRequest() {
    const phone = (import.meta.env.VITE_WHATSAPP_NUMBER || '').replace(/\D/g, '');
    const lines = items.map(
      (item) =>
        `• ${item.name} — ${item.color} — ${item.quantity} un. (${formatPrice(item.price * item.quantity)})`,
    );
    const message = [
      'Oi! Quero pedir para separar estas peças:',
      '',
      ...lines,
      '',
      `Total das peças: ${formatPrice(total)}`,
      '',
      'Pode me confirmar a disponibilidade?',
    ].join('\n');
    const url = phone
      ? `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
      : `https://wa.me/?text=${encodeURIComponent(message)}`;
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
                <article className="cart-item" key={`${item.id}-${item.color}`}>
                  <img src={item.image} alt={item.imageAlt} />
                  <div className="cart-item-details">
                    <div className="cart-item-title">
                      <div>
                        <h3>{item.name}</h3>
                        <p>{item.color}</p>
                      </div>
                      <button
                        type="button"
                        className="remove-button"
                        aria-label={`Remover ${item.name}`}
                        onClick={() => onRemove(item.id, item.color)}
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
                            onQuantityChange(item.id, item.color, item.quantity - 1)
                          }
                        >
                          <Icon name="minus" size={14} />
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          type="button"
                          aria-label="Aumentar quantidade"
                          disabled={item.quantity >= item.stock}
                          onClick={() =>
                            onQuantityChange(item.id, item.color, item.quantity + 1)
                          }
                        >
                          <Icon name="plus" size={14} />
                        </button>
                      </div>
                      <strong>{formatPrice(item.price * item.quantity)}</strong>
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
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('destaques');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase('pt-BR');
    const filtered = products.filter((product) => {
      const matchesCategory =
        activeCategory === 'Todas as peças' || product.category === activeCategory;
      const matchesSearch =
        !normalizedSearch ||
        `${product.name} ${product.category} ${product.colors.map((color) => color.name).join(' ')}`
          .toLocaleLowerCase('pt-BR')
          .includes(normalizedSearch);
      return matchesCategory && matchesSearch;
    });

    if (sortBy === 'menor-preco') return filtered.sort((a, b) => a.price - b.price);
    if (sortBy === 'maior-preco') return filtered.sort((a, b) => b.price - a.price);
    return filtered;
  }, [activeCategory, search, sortBy]);

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  function addToCart(product, color, quantity) {
    setCart((current) => {
      const existing = current.find(
        (item) => item.id === product.id && item.color === color.name,
      );
      if (!existing) {
        return [
          ...current,
          {
            ...product,
            color: color.name,
            stock: color.stock,
            quantity,
          },
        ];
      }
      return current.map((item) =>
        item.id === product.id && item.color === color.name
          ? { ...item, quantity: Math.min(item.stock, item.quantity + quantity) }
          : item,
      );
    });
    setIsCartOpen(true);
  }

  function changeCartQuantity(id, color, quantity) {
    setCart((current) =>
      current.map((item) =>
        item.id === id && item.color === color
          ? { ...item, quantity: Math.max(1, Math.min(item.stock, quantity)) }
          : item,
      ),
    );
  }

  function removeFromCart(id, color) {
    setCart((current) =>
      current.filter((item) => item.id !== id || item.color !== color),
    );
  }

  return (
    <div className="site-shell">
      <div className="announcement">
        <span>PEÇAS ESCOLHIDAS COM CARINHO, SEPARADAS PRA VOCÊ</span>
        <span className="announcement-right">Atendimento próximo, sempre <span>♡</span></span>
      </div>
      <header className="site-header">
        <a className="brand" href="#inicio" aria-label="entrelaço, início">
          <span className="brand-mark">e</span>
          <span>entrelaço<span className="brand-dot">.</span></span>
        </a>
        <nav className="main-nav" aria-label="Navegação principal">
          <a className="nav-active" href="#colecao">A coleção</a>
          <a href="#sobre">Nossa essência</a>
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
        <section className="hero" id="inicio">
          <div className="hero-content">
            <span className="eyebrow"><span className="eyebrow-line" /> MODA COM AFETO, DO SEU JEITO</span>
            <h1>Vista o que<br />faz <em>sentido.</em></h1>
            <p>Uma curadoria de peças para acompanhar seus dias — e celebrar quem você é, em cada detalhe.</p>
            <a className="hero-link" href="#colecao">
              Descubra a coleção <span><Icon name="arrow" size={17} /></span>
            </a>
            <div className="hero-note">
              <span className="note-star">✳</span>
              <span>Gostou? A gente separa<br />pra você pelo WhatsApp.</span>
            </div>
          </div>
          <div className="hero-photo">
            <img
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1600&q=90"
              alt="Amigas aproveitando um dia de compras juntas"
            />
            <div className="photo-caption"><span>01 / 03</span><span>Um jeito mais leve de escolher.</span></div>
            <div className="photo-stamp"><span>feito<br />pra você</span><span className="stamp-heart">♡</span></div>
          </div>
          <div className="hero-index">COLEÇÃO  —  2026</div>
        </section>

        <section className="collection-section" id="colecao">
          <div className="section-intro">
            <div>
              <span className="eyebrow"><span className="eyebrow-line" /> ESCOLHAS QUE CONTAM HISTÓRIAS</span>
              <h2>Um pouco de <em>você</em><br />em cada peça.</h2>
            </div>
            <p>Peças especiais, cores que combinam com seu momento e aquele cuidado que faz toda diferença. Explore sem pressa.</p>
          </div>
          <div className="catalog-toolbar">
            <div className="category-list" role="group" aria-label="Filtrar por categoria">
              {categories.map((category) => (
                <button
                  type="button"
                  key={category}
                  className={`category-button ${activeCategory === category ? 'is-active' : ''}`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
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
            <span className="results-detail">TOQUE NA COR PARA VER DISPONIBILIDADE</span>
          </div>
          {filteredProducts.length > 0 ? (
            <div className="product-grid">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} onAdd={addToCart} />
              ))}
            </div>
          ) : (
            <div className="no-results">
              <span>♡</span>
              <h3>Não encontramos essa peça.</h3>
              <p>Tente outro nome ou escolha uma categoria diferente.</p>
              <button
                type="button"
                className="text-button"
                onClick={() => {
                  setSearch('');
                  setActiveCategory(categories[0]);
                }}
              >
                Ver todas as peças <Icon name="arrow" size={16} />
              </button>
            </div>
          )}
        </section>

        <section className="experience-banner" id="sobre">
          <div className="experience-icon">♡</div>
          <div>
            <span className="eyebrow">UMA EXPERIÊNCIA MAIS PESSOAL</span>
            <h2>Você escolhe. A gente separa.<br /><em>Sem pressa, sem complicação.</em></h2>
          </div>
          <p>Monte sua seleção e chama a gente no WhatsApp. Confirmamos as cores, quantidades e todos os detalhes com você.</p>
          <a href="#colecao" aria-label="Voltar para a coleção"><Icon name="arrow" size={20} /></a>
        </section>
      </main>

      <footer className="site-footer">
        <a className="brand footer-brand" href="#inicio">
          <span className="brand-mark">e</span>
          <span>entrelaço<span className="brand-dot">.</span></span>
        </a>
        <p>Feito com carinho, para vestir a sua história.</p>
        <span>© 2026 entrelaço. Todos os direitos reservados.</span>
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
