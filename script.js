/**
 * Annyshub — Main JavaScript v3
 * Covers: nav, cart, search, toast, reveal, admin, product pages
 */
'use strict';

/* ═══════════════════════════════════════════════════
   CART STORE
═══════════════════════════════════════════════════ */
const Cart = (() => {
  const KEY = 'annyshub_cart';
  const get = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; } };
  const save = (items) => { try { localStorage.setItem(KEY, JSON.stringify(items)); } catch {} };
  const add = (product) => {
    const items = get();
    const existing = items.find(i => i.id === product.id);
    if (existing) { existing.qty = Math.min(existing.qty + 1, 99); }
    else { items.push({ ...product, qty: 1 }); }
    save(items); updateBadge(); return items;
  };
  const remove = (id) => { const items = get().filter(i => i.id !== id); save(items); updateBadge(); return items; };
  const setQty = (id, qty) => {
    const items = get();
    const item = items.find(i => i.id === id);
    if (item) { if (qty < 1) { return remove(id); } item.qty = Math.min(qty, 99); save(items); updateBadge(); }
    return items;
  };
  const total = () => get().reduce((sum, i) => sum + i.price * i.qty, 0);
  const count = () => get().reduce((sum, i) => sum + i.qty, 0);
  const clear = () => { save([]); updateBadge(); };
  const updateBadge = () => {
    const badge = document.getElementById('cartBadge');
    if (!badge) return;
    const n = count();
    badge.textContent = n;
    badge.classList.toggle('hidden', n === 0);
  };
  return { get, add, remove, setQty, total, count, clear, updateBadge };
})();

/* ═══════════════════════════════════════════════════
   TOAST
═══════════════════════════════════════════════════ */
const Toast = (() => {
  let wrap;
  const init = () => {
    wrap = document.getElementById('toastWrap');
    if (!wrap) { wrap = document.createElement('div'); wrap.id = 'toastWrap'; wrap.className = 'toast-wrap'; document.body.appendChild(wrap); }
  };
  const show = (msg, type = '', icon = '') => {
    if (!wrap) init();
    const t = document.createElement('div');
    t.className = `toast${type ? ' toast--' + type : ''}`;
    t.innerHTML = `${icon ? `<span class="toast__icon">${icon}</span>` : ''}<span>${msg}</span>`;
    wrap.appendChild(t);
    setTimeout(() => { t.classList.add('toast--out'); setTimeout(() => t.remove(), 300); }, 3000);
  };
  const success = (msg) => show(msg, 'success', '✓');
  const error   = (msg) => show(msg, 'error', '✕');
  const info    = (msg) => show(msg, '', 'ℹ');
  return { show, success, error, info };
})();

/* ═══════════════════════════════════════════════════
   NAVIGATION
═══════════════════════════════════════════════════ */
(function initNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;

  // Scroll shadow
  window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 10), { passive: true });
  nav.classList.toggle('scrolled', window.scrollY > 10);

  // Active link
  const page = document.body.dataset.page || '';
  document.querySelectorAll('[data-nav]').forEach(link => {
    link.classList.toggle('active', link.dataset.nav === page);
  });

  // Cart badge init
  Cart.updateBadge();

  // Cart icon → cart page
  const cartBtn = document.getElementById('cartBtn');
  if (cartBtn) cartBtn.addEventListener('click', () => { window.location.href = 'cart.html'; });

  // Burger
  const burger = document.getElementById('navBurger');
  const mobile = document.getElementById('navMobile');
  if (burger && mobile) {
    const close = () => {
      mobile.classList.remove('open'); burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false'); mobile.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };
    burger.addEventListener('click', () => {
      const open = mobile.classList.toggle('open');
      burger.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', open);
      mobile.setAttribute('aria-hidden', !open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    document.addEventListener('click', e => { if (mobile.classList.contains('open') && !burger.contains(e.target) && !mobile.contains(e.target)) close(); });
    mobile.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  }

  // Search
  const searchToggle = document.getElementById('searchToggle');
  const searchBox    = document.getElementById('searchBox');
  const searchInput  = document.getElementById('searchInput');
  if (searchToggle && searchBox) {
    searchToggle.addEventListener('click', e => {
      e.stopPropagation();
      const open = searchBox.classList.toggle('open');
      if (open && searchInput) setTimeout(() => searchInput.focus(), 50);
    });
    document.addEventListener('click', e => { if (!searchBox.contains(e.target) && !searchToggle.contains(e.target)) searchBox.classList.remove('open'); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') searchBox.classList.remove('open'); });
    if (searchInput) {
      searchInput.addEventListener('keydown', e => {
        if (e.key === 'Enter' && searchInput.value.trim()) {
          window.location.href = `search.html?q=${encodeURIComponent(searchInput.value.trim())}`;
        }
      });
    }
  }
})();

/* ═══════════════════════════════════════════════════
   SCROLL REVEAL
═══════════════════════════════════════════════════ */
(function initReveal() {
  const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (!els.length) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { els.forEach(el => el.classList.add('visible')); return; }
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
  }, { threshold: 0.1, rootMargin: '0px 0px -32px 0px' });
  els.forEach(el => io.observe(el));
})();

/* ═══════════════════════════════════════════════════
   SMOOTH SCROLL
═══════════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1); if (!id) return;
    const el = document.getElementById(id); if (!el) return;
    e.preventDefault();
    const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 68;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - navH - 16, behavior: 'smooth' });
  });
});

/* ═══════════════════════════════════════════════════
   TICKER
═══════════════════════════════════════════════════ */
(function initTicker() {
  const ticker = document.querySelector('.ticker');
  if (!ticker) return;
  const tracks = ticker.querySelectorAll('.ticker__track');
  ticker.addEventListener('mouseenter', () => tracks.forEach(t => t.style.animationPlayState = 'paused'));
  ticker.addEventListener('mouseleave', () => tracks.forEach(t => t.style.animationPlayState = 'running'));
})();

/* ═══════════════════════════════════════════════════
   HOMEPAGE — render featured products
═══════════════════════════════════════════════════ */
(function initHomepage() {
  if (document.body.dataset.page !== 'home') return;
  const grid = document.getElementById('featuredGrid');
  if (!grid || !window.AnnyshubData) return;

  const products = AnnyshubData.getFeatured();
  grid.innerHTML = products.map(p => `
    <article class="product-card reveal">
      <div class="product-card__img-wrap">
        <img src="${p.img}" alt="${p.name}" loading="lazy" />
        <div class="product-card__hover">
          <a href="product.html?id=${p.id}" class="btn btn--plum btn--sm">View Details</a>
        </div>
      </div>
      <div class="product-card__body">
        <h3 class="product-card__name">${p.name}</h3>
        <p class="product-card__tag">${p.tag}</p>
        <strong class="product-card__price">₦${p.price.toLocaleString()}</strong>
      </div>
    </article>`).join('');

  // Re-run reveal observer on new elements
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
  }, { threshold: 0.1 });
  grid.querySelectorAll('.reveal').forEach(el => io.observe(el));
})();

/* ═══════════════════════════════════════════════════
   COLLECTIONS PAGE
═══════════════════════════════════════════════════ */
(function initCollections() {
  if (document.body.dataset.page !== 'collections') return;
  if (!window.AnnyshubData) return;

  const renderSection = (sectionId, categoryKey, limit = 4) => {
    const container = document.getElementById(sectionId);
    if (!container) return;
    const products = AnnyshubData.getByCategory(categoryKey).slice(0, limit);
    container.innerHTML = products.map((p, i) => buildShopCard(p, i)).join('');
    attachCartHandlers(container);
    revealCards(container);
  };

  renderSection('necklacesGrid', 'necklace');
  renderSection('watchesGrid',   'watch');
  renderSection('braceletsGrid', 'bracelet');
  renderSection('combosGrid',    'combo');
  renderSection('setsGrid',      'set');

  // Filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      document.querySelectorAll('.coll-section').forEach(sec => {
        sec.style.display = (filter === 'all' || sec.dataset.category === filter) ? '' : 'none';
      });
    });
  });
})();

/* ═══════════════════════════════════════════════════
   CATEGORY PAGE (necklaces, bracelets, wristwatches)
═══════════════════════════════════════════════════ */
(function initCategoryPage() {
  const page = document.body.dataset.page;
  const catMap = { necklaces: 'necklace', bracelets: 'bracelet', wristwatches: 'watch', sets: 'set', combos: 'combo' };
  const cat = catMap[page];
  if (!cat || !window.AnnyshubData) return;

  const grid = document.getElementById('categoryGrid');
  if (!grid) return;

  let products = AnnyshubData.getByCategory(cat);
  let sortVal = 'default';

  const render = () => {
    let sorted = [...products];
    if (sortVal === 'price-asc')  sorted.sort((a,b) => a.price - b.price);
    if (sortVal === 'price-desc') sorted.sort((a,b) => b.price - a.price);
    if (sortVal === 'name')       sorted.sort((a,b) => a.name.localeCompare(b.name));

    grid.innerHTML = sorted.length
      ? sorted.map((p, i) => buildShopCard(p, i)).join('')
      : '<p class="no-results">No products found in this category.</p>';

    const counter = document.getElementById('productCount');
    if (counter) counter.textContent = `${sorted.length} product${sorted.length !== 1 ? 's' : ''}`;

    attachCartHandlers(grid);
    revealCards(grid);
  };

  render();

  const sortEl = document.getElementById('sortSelect');
  if (sortEl) sortEl.addEventListener('change', () => { sortVal = sortEl.value; render(); });
})();

/* ═══════════════════════════════════════════════════
   PRODUCT DETAIL PAGE
═══════════════════════════════════════════════════ */
(function initProductPage() {
  if (document.body.dataset.page !== 'product') return;
  if (!window.AnnyshubData) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const product = id ? AnnyshubData.getById(id) : null;

  const root = document.getElementById('productRoot');
  if (!root) return;

  if (!product) {
    root.innerHTML = `<div class="container" style="padding-block:80px;text-align:center">
      <p style="font-size:48px">💎</p>
      <h2 style="font-family:var(--font-display);font-size:28px;margin:12px 0 8px">Product not found</h2>
      <p style="color:var(--muted);margin-bottom:24px">This product may have been removed or the link is incorrect.</p>
      <a href="collections.html" class="btn btn--plum">Browse All Collections</a></div>`;
    return;
  }

  // Breadcrumb
  const bc = document.getElementById('breadcrumb');
  if (bc) bc.innerHTML = `<a href="index.html">Home</a><span>›</span><a href="collections.html">Collections</a><span>›</span><span>${product.name}</span>`;

  // Main content
  root.innerHTML = `
    <div class="container">
      <div class="product-detail__grid">
        <div class="product-detail__gallery animate-fadein">
          <div class="product-detail__main-img" id="mainImg">
            <img src="${product.img}" alt="${product.name}" />
          </div>
          <div class="product-detail__thumbs">
            <div class="product-detail__thumb active" data-src="${product.img}"><img src="${product.img}" alt="${product.name}" /></div>
            <div class="product-detail__thumb" data-src="https://images.unsplash.com/photo-1611107419963-b14ab5e47a02?w=300&q=70"><img src="https://images.unsplash.com/photo-1611107419963-b14ab5e47a02?w=300&q=70" alt="View 2" /></div>
            <div class="product-detail__thumb" data-src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=300&q=70"><img src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=300&q=70" alt="View 3" /></div>
          </div>
        </div>
        <div class="product-detail__info animate-fadein-delay">
          <h1 class="product-detail__name">${product.name}</h1>
          <div class="product-detail__price">₦${product.price.toLocaleString()}</div>
          <div class="product-detail__rating">
            <div class="stars-display">${'★'.repeat(product.rating || 4)}${'☆'.repeat(5-(product.rating||4))}</div>
            <span class="product-detail__review-count">${product.reviews || 0} Customer Review${(product.reviews||0)!==1?'s':''}</span>
          </div>
          <div class="product-detail__divider"></div>
          <p class="product-detail__desc">${product.description}</p>
          <div>
            <span class="product-detail__tag-badge">✓ ${product.tag}</span>
            ${product.inStock ? '<span class="product-detail__tag-badge" style="margin-left:8px">✓ In Stock</span>' : '<span class="product-detail__tag-badge" style="background:#fdecea;color:var(--error)">Out of Stock</span>'}
          </div>
          <div class="product-detail__actions">
            <a href="https://wa.me/2348157334619?text=Hi%2C%20I%27d%20like%20to%20order%20${encodeURIComponent(product.name)}%20-%20%E2%82%A6${product.price.toLocaleString()}" 
               class="btn btn--plum" target="_blank" rel="noopener">Order via WhatsApp</a>
            <button class="btn btn--outline" id="addToCartBtn">Add to Cart</button>
          </div>
        </div>
      </div>
    </div>`;

  // Thumb switcher
  root.querySelectorAll('.product-detail__thumb').forEach(thumb => {
    thumb.addEventListener('click', () => {
      root.querySelectorAll('.product-detail__thumb').forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
      const mainImg = root.querySelector('#mainImg img');
      if (mainImg) { mainImg.style.opacity = '0'; setTimeout(() => { mainImg.src = thumb.dataset.src; mainImg.style.opacity = '1'; }, 150); mainImg.style.transition = 'opacity .15s'; }
    });
  });

  // Add to cart
  const addBtn = root.querySelector('#addToCartBtn');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      Cart.add({ id: product.id, name: product.name, price: product.price, img: product.img });
      Toast.success(`${product.name} added to cart`);
      addBtn.textContent = '✓ Added!';
      setTimeout(() => { addBtn.textContent = 'Add to Cart'; }, 1800);
    });
  }

  // Related
  const relatedGrid = document.getElementById('relatedGrid');
  if (relatedGrid) {
    const related = AnnyshubData.getByCategory(product.category).filter(p => p.id !== product.id).slice(0, 3);
    relatedGrid.innerHTML = related.map((p, i) => buildShopCard(p, i)).join('');
    attachCartHandlers(relatedGrid);
    revealCards(relatedGrid);
  }
})();

/* ═══════════════════════════════════════════════════
   CART PAGE
═══════════════════════════════════════════════════ */
(function initCartPage() {
  if (document.body.dataset.page !== 'cart') return;

  const itemsEl   = document.getElementById('cartItems');
  const summaryEl = document.getElementById('orderSummary');
  if (!itemsEl || !summaryEl) return;

  const render = () => {
    const items = Cart.get();

    if (!items.length) {
      itemsEl.innerHTML = `
        <div class="cart-empty">
          <div class="cart-empty__icon">🛍️</div>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added anything yet. Browse our beautiful collections.</p>
          <a href="collections.html" class="btn btn--plum">Browse Collections</a>
        </div>`;
      summaryEl.style.display = 'none';
      return;
    }

    summaryEl.style.display = '';
    itemsEl.innerHTML = `<div class="cart-items">${items.map(item => `
      <div class="cart-item" data-id="${item.id}">
        <div class="cart-item__img"><img src="${item.img}" alt="${item.name}" /></div>
        <div class="cart-item__info">
          <h3>${item.name}</h3>
          <p class="cart-item__price">₦${(item.price * item.qty).toLocaleString()}</p>
        </div>
        <div class="cart-item__controls">
          <button class="cart-item__delete" aria-label="Remove" data-action="remove" data-id="${item.id}">
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 6h18M19 6l-1 14H6L5 6M8 6V4h8v2"/></svg>
          </button>
          <div class="qty-control">
            <button class="qty-btn" data-action="dec" data-id="${item.id}">−</button>
            <div class="qty-display">${item.qty}</div>
            <button class="qty-btn" data-action="inc" data-id="${item.id}">+</button>
          </div>
        </div>
      </div>`).join('')}</div>`;

    const total = Cart.total();
    summaryEl.innerHTML = `
      <div class="order-summary">
        <h2>Order Summary</h2>
        <div class="order-summary__row"><span>Subtotal (${Cart.count()} item${Cart.count()!==1?'s':''})</span><span>₦${total.toLocaleString()}</span></div>
        <div class="order-summary__row"><span>Delivery</span><span style="color:var(--success);font-weight:600">Calculated on WhatsApp</span></div>
        <div class="order-summary__row order-summary__row--total"><span>Total</span><span>₦${total.toLocaleString()}</span></div>
        <a href="${buildWhatsAppCartMsg()}" class="btn btn--plum btn--lg order-summary__wa-btn" target="_blank" rel="noopener">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.121.554 4.11 1.523 5.837L0 24l6.326-1.501A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.659-.5-5.192-1.375l-.371-.22-3.754.89.944-3.648-.241-.381A9.96 9.96 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
          Order on WhatsApp
        </a>
        <p class="order-summary__note">We'll confirm your order, give you the full price including delivery, and keep you updated every step of the way.</p>
      </div>`;

    // Event delegation
    document.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', () => {
        const { action, id } = btn.dataset;
        if (action === 'remove') { Cart.remove(id); render(); Toast.info('Item removed'); }
        if (action === 'dec')    { Cart.setQty(id, (Cart.get().find(i=>i.id===id)?.qty||1)-1); render(); }
        if (action === 'inc')    { Cart.setQty(id, (Cart.get().find(i=>i.id===id)?.qty||0)+1); render(); }
      });
    });
  };

  const buildWhatsAppCartMsg = () => {
    const items = Cart.get();
    const lines = items.map(i => `• ${i.name} x${i.qty} = ₦${(i.price*i.qty).toLocaleString()}`).join('%0A');
    const total = Cart.total();
    const msg = `Hi Annyshub! I'd like to place an order:%0A%0A${lines}%0A%0ATotal: ₦${total.toLocaleString()}%0A%0APlease let me know the delivery cost.`;
    return `https://wa.me/2348157334619?text=${msg}`;
  };

  render();
})();

/* ═══════════════════════════════════════════════════
   SEARCH PAGE
═══════════════════════════════════════════════════ */
(function initSearchPage() {
  if (document.body.dataset.page !== 'search') return;
  if (!window.AnnyshubData) return;

  const params = new URLSearchParams(window.location.search);
  const query  = params.get('q') || '';
  const grid   = document.getElementById('searchGrid');
  const meta   = document.getElementById('searchMeta');
  const h1     = document.getElementById('searchTitle');
  if (!grid) return;

  if (h1) h1.textContent = query ? `Results for "${query}"` : 'Search Products';

  if (!query) {
    grid.innerHTML = '<p style="color:var(--muted);font-size:15px">Enter a search term to find products.</p>';
    return;
  }

  const results = AnnyshubData.search(query);
  if (meta) meta.textContent = `${results.length} result${results.length !== 1 ? 's' : ''} found`;

  grid.innerHTML = results.length
    ? results.map((p, i) => buildShopCard(p, i)).join('')
    : `<div style="grid-column:1/-1;text-align:center;padding:60px 0">
        <p style="font-size:40px">🔍</p>
        <h3 style="font-family:var(--font-display);font-size:24px;margin:12px 0 8px;color:var(--dark)">No results found</h3>
        <p style="color:var(--muted);margin-bottom:20px">Try a different search term or browse our collections.</p>
        <a href="collections.html" class="btn btn--plum">Browse Collections</a></div>`;

  attachCartHandlers(grid);
  revealCards(grid);
})();

/* ═══════════════════════════════════════════════════
   SHARED HELPERS
═══════════════════════════════════════════════════ */
function buildShopCard(p, i = 0) {
  const outOfStock = !p.inStock;
  return `
    <article class="shop-card reveal" style="--delay:${i * 0.06}s" data-category="${p.category}">
      <div class="shop-card__img-wrap">
        <a href="product.html?id=${p.id}">
          <img src="${p.img}" alt="${p.name}" loading="lazy" />
        </a>
        ${outOfStock ? '<span class="shop-card__badge shop-card__badge--out">Sold Out</span>' : ''}
        <button class="shop-card__wishlist" aria-label="Save to wishlist" data-id="${p.id}">♡</button>
      </div>
      <div class="shop-card__body">
        <h3><a href="product.html?id=${p.id}">${p.name}</a></h3>
        <p class="shop-card__tag">${p.tag}</p>
        <strong class="shop-card__price">₦${p.price.toLocaleString()}</strong>
        <div class="shop-card__actions">
          <a href="https://wa.me/2348157334619?text=Hi%2C%20I%27d%20like%20to%20order%20${encodeURIComponent(p.name)}%20-%20%E2%82%A6${p.price.toLocaleString()}"
             class="btn btn--plum btn--sm${outOfStock ? ' btn--disabled' : ''}" target="_blank" rel="noopener"
             ${outOfStock ? 'tabindex="-1" aria-disabled="true"' : ''}>Order on WhatsApp</a>
          <button class="shop-card__cart-btn" aria-label="Add to cart"
            data-id="${p.id}" data-name="${p.name}" data-price="${p.price}" data-img="${p.img}"
            ${outOfStock ? 'disabled' : ''}>
            <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          </button>
        </div>
      </div>
    </article>`;
}

function attachCartHandlers(container) {
  container.querySelectorAll('.shop-card__cart-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const { id, name, price, img } = btn.dataset;
      Cart.add({ id, name, price: parseInt(price), img });
      Toast.success(`${name} added to cart`);
      btn.innerHTML = '✓';
      btn.style.color = 'var(--success)';
      btn.style.borderColor = 'var(--success)';
      setTimeout(() => {
        btn.innerHTML = `<svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`;
        btn.style.color = '';
        btn.style.borderColor = '';
      }, 1500);
    });
  });
  container.querySelectorAll('.shop-card__wishlist').forEach(btn => {
    btn.addEventListener('click', () => { btn.classList.toggle('active'); btn.textContent = btn.classList.contains('active') ? '♥' : '♡'; });
  });
}

function revealCards(container) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { container.querySelectorAll('.reveal').forEach(el => el.classList.add('visible')); return; }
  const io = new IntersectionObserver(entries => { entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } }); }, { threshold: 0.08 });
  container.querySelectorAll('.reveal').forEach(el => io.observe(el));
}

/* ═══════════════════════════════════════════════════
   ADMIN PANEL
═══════════════════════════════════════════════════ */
(function initAdmin() {
  if (document.body.dataset.page !== 'admin') return;

  const ADMIN_PASS = 'annyshub2026';

  // ── Login gate ──
  const loginWrap = document.getElementById('adminLogin');
  const panelWrap = document.getElementById('adminPanel');
  const loginForm = document.getElementById('loginForm');
  const loginErr  = document.getElementById('loginError');

  const isAuthed = () => sessionStorage.getItem('annyshub_admin') === 'true';
  const showPanel = () => { if(loginWrap) loginWrap.style.display='none'; if(panelWrap) panelWrap.style.display=''; };
  const showLogin = () => { if(loginWrap) loginWrap.style.display=''; if(panelWrap) panelWrap.style.display='none'; };

  if (isAuthed()) { showPanel(); } else { showLogin(); }

  if (loginForm) {
    loginForm.addEventListener('submit', e => {
      e.preventDefault();
      const pass = document.getElementById('adminPass')?.value;
      if (pass === ADMIN_PASS) {
        sessionStorage.setItem('annyshub_admin', 'true');
        showPanel(); renderAdmin();
      } else {
        if (loginErr) { loginErr.textContent = 'Incorrect password. Try again.'; loginErr.classList.add('show'); }
      }
    });
  }

  const logoutBtn = document.getElementById('adminLogout');
  if (logoutBtn) logoutBtn.addEventListener('click', () => { sessionStorage.removeItem('annyshub_admin'); showLogin(); });

  if (!isAuthed()) return;

  // ── Admin State ──
  let editingId    = null;
  let deletingId   = null;
  let searchQuery  = '';
  let filterCat    = 'all';

  // ── Element refs ──
  const tableBody   = document.getElementById('adminTableBody');
  const statsEls    = { total: document.getElementById('statTotal'), inStock: document.getElementById('statInStock'), cats: document.getElementById('statCats'), featured: document.getElementById('statFeatured') };
  const searchInput = document.getElementById('adminSearch');
  const catFilter   = document.getElementById('adminCatFilter');
  const addBtn      = document.getElementById('addProductBtn');
  const modal       = document.getElementById('productModal');
  const modalTitle  = document.getElementById('modalTitle');
  const deleteModal = document.getElementById('deleteModal');
  const deleteMsg   = document.getElementById('deleteMsg');
  const productForm = document.getElementById('productForm');
  const imgPreview  = document.getElementById('imgPreviewEl');
  const imgInput    = document.getElementById('formImg');

  // ── Render stats ──
  const renderStats = () => {
    if (!window.AnnyshubData) return;
    const all = AnnyshubData.getAll();
    if (statsEls.total)    statsEls.total.textContent    = all.length;
    if (statsEls.inStock)  statsEls.inStock.textContent  = all.filter(p=>p.inStock).length;
    if (statsEls.cats)     statsEls.cats.textContent     = [...new Set(all.map(p=>p.category))].length;
    if (statsEls.featured) statsEls.featured.textContent = all.filter(p=>p.featured).length;
  };

  // ── Render table ──
  const renderTable = () => {
    if (!tableBody || !window.AnnyshubData) return;
    let products = AnnyshubData.getAll();
    if (filterCat !== 'all') products = products.filter(p => p.category === filterCat);
    if (searchQuery) products = products.filter(p => p.name.toLowerCase().includes(searchQuery) || p.category.toLowerCase().includes(searchQuery));

    if (!products.length) {
      tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:40px;color:var(--muted)">No products found</td></tr>`;
      return;
    }

    tableBody.innerHTML = products.map(p => `
      <tr>
        <td data-label="Product">
          <div style="display:flex;align-items:center;gap:12px">
            <div class="admin-table__img"><img src="${p.img}" alt="${p.name}" /></div>
            <span class="admin-table__name">${p.name}</span>
          </div>
        </td>
        <td data-label="Category"><span class="admin-table__cat">${p.category}</span></td>
        <td data-label="Price"><span class="admin-table__price">₦${p.price.toLocaleString()}</span></td>
        <td data-label="Stock"><span class="status-badge ${p.inStock?'status-badge--in':'status-badge--out'}">${p.inStock?'In Stock':'Out of Stock'}</span></td>
        <td data-label="Featured"><span class="status-badge ${p.featured?'status-badge--feat':''}"> ${p.featured?'✦ Featured':'—'}</span></td>
        <td data-label="Actions">
          <div class="admin-table__actions">
            <button class="btn btn--ghost btn--sm" data-edit="${p.id}">Edit</button>
            <button class="btn btn--danger btn--sm" data-delete="${p.id}" data-name="${p.name}">Delete</button>
          </div>
        </td>
      </tr>`).join('');

    // Edit
    tableBody.querySelectorAll('[data-edit]').forEach(btn => {
      btn.addEventListener('click', () => openEditModal(btn.dataset.edit));
    });
    // Delete
    tableBody.querySelectorAll('[data-delete]').forEach(btn => {
      btn.addEventListener('click', () => openDeleteModal(btn.dataset.delete, btn.dataset.name));
    });
  };

  const renderAdmin = () => { renderStats(); renderTable(); };
  renderAdmin();

  // ── Search & Filter ──
  if (searchInput) searchInput.addEventListener('input', () => { searchQuery = searchInput.value.toLowerCase().trim(); renderTable(); });
  if (catFilter)   catFilter.addEventListener('change', () => { filterCat = catFilter.value; renderTable(); });

  // ── Modal helpers ──
  const openModal = () => { if(modal) modal.classList.remove('hidden'); document.body.style.overflow='hidden'; };
  const closeModal = () => { if(modal) modal.classList.add('hidden'); document.body.style.overflow=''; editingId=null; if(productForm) productForm.reset(); updateImgPreview(''); };
  const openDeleteModal = (id, name) => { deletingId=id; if(deleteMsg) deleteMsg.innerHTML=`Are you sure you want to delete <strong>${name}</strong>? This cannot be undone.`; if(deleteModal) deleteModal.classList.remove('hidden'); document.body.style.overflow='hidden'; };
  const closeDeleteModal = () => { if(deleteModal) deleteModal.classList.add('hidden'); document.body.style.overflow=''; deletingId=null; };

  const updateImgPreview = (src) => {
    if (!imgPreview) return;
    imgPreview.innerHTML = src
      ? `<img src="${src}" alt="Preview" />`
      : `<div class="img-preview__placeholder"><span>🖼️</span><span>Paste image URL below to preview</span></div>`;
  };

  if (imgInput) imgInput.addEventListener('input', () => updateImgPreview(imgInput.value.trim()));

  // ── Open Add Modal ──
  if (addBtn) addBtn.addEventListener('click', () => {
    editingId = null;
    if (modalTitle) modalTitle.textContent = 'Add New Product';
    if (productForm) productForm.reset();
    updateImgPreview('');
    openModal();
  });

  // ── Open Edit Modal ──
  const openEditModal = (id) => {
    const p = AnnyshubData.getById(id);
    if (!p) return;
    editingId = id;
    if (modalTitle) modalTitle.textContent = 'Edit Product';
    const set = (sel, val) => { const el = productForm?.querySelector(sel); if (el) { if (el.type === 'checkbox') el.checked = !!val; else el.value = val ?? ''; } };
    set('#formName',     p.name);
    set('#formCategory', p.category);
    set('#formPrice',    p.price);
    set('#formTag',      p.tag);
    set('#formDesc',     p.description);
    set('#formImg',      p.img);
    set('#formInStock',  p.inStock);
    set('#formFeatured', p.featured);
    set('#formRating',   p.rating);
    set('#formReviews',  p.reviews);
    updateImgPreview(p.img);
    openModal();
  };

  // ── Close buttons ──
  document.querySelectorAll('[data-close-modal]').forEach(btn => btn.addEventListener('click', closeModal));
  document.querySelectorAll('[data-close-delete]').forEach(btn => btn.addEventListener('click', closeDeleteModal));
  if (modal) modal.addEventListener('click', e => { if(e.target===modal) closeModal(); });
  if (deleteModal) deleteModal.addEventListener('click', e => { if(e.target===deleteModal) closeDeleteModal(); });

  // ── Save product ──
  if (productForm) {
    productForm.addEventListener('submit', e => {
      e.preventDefault();
      const data = {
        name:        productForm.querySelector('#formName')?.value.trim(),
        category:    productForm.querySelector('#formCategory')?.value,
        price:       parseInt(productForm.querySelector('#formPrice')?.value) || 0,
        tag:         productForm.querySelector('#formTag')?.value.trim() || '100% Non Tarnish',
        description: productForm.querySelector('#formDesc')?.value.trim(),
        img:         productForm.querySelector('#formImg')?.value.trim(),
        inStock:     productForm.querySelector('#formInStock')?.checked ?? true,
        featured:    productForm.querySelector('#formFeatured')?.checked ?? false,
        rating:      parseInt(productForm.querySelector('#formRating')?.value) || 4,
        reviews:     parseInt(productForm.querySelector('#formReviews')?.value) || 0,
      };
      if (!data.name || !data.price || !data.img) { Toast.error('Name, price, and image URL are required.'); return; }
      if (editingId) { AnnyshubData.update(editingId, data); Toast.success('Product updated!'); }
      else           { AnnyshubData.add(data); Toast.success('Product added!'); }
      closeModal(); renderAdmin();
    });
  }

  // ── Confirm delete ──
  const confirmDeleteBtn = document.getElementById('confirmDelete');
  if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener('click', () => {
      if (!deletingId) return;
      AnnyshubData.remove(deletingId);
      Toast.success('Product deleted.');
      closeDeleteModal(); renderAdmin();
    });
  }

  // ── Reset to defaults ──
  const resetBtn = document.getElementById('resetDataBtn');
  if (resetBtn) resetBtn.addEventListener('click', () => {
    if (confirm('Reset all products to defaults? This cannot be undone.')) {
      AnnyshubData.resetToDefaults(); renderAdmin(); Toast.info('Products reset to defaults.');
    }
  });
})();

window.Cart  = Cart;
window.Toast = Toast;