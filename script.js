/**
 * Annyshub — Main Script v4
 * Cart · Nav · Toast · Reveal · Pages · Reviews
 */
'use strict';

/* ═══════════════════════════════════════
   CART
═══════════════════════════════════════ */
const Cart = (() => {
  const KEY = 'ann_cart';
  const _get  = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; } };
  const _save = (items) => { try { localStorage.setItem(KEY, JSON.stringify(items)); } catch {} };

  const get = () => _get();

  const add = (p) => {
    const items = _get();
    const ex = items.find(i => i.id === p.id);
    if (ex) ex.qty = Math.min(ex.qty + 1, 99);
    else items.push({ ...p, qty: 1 });
    _save(items); _updateAllBadges(); return items;
  };

  const remove = (id) => { const items = _get().filter(i => i.id !== id); _save(items); _updateAllBadges(); return items; };

  const setQty = (id, qty) => {
    if (qty < 1) return remove(id);
    const items = _get();
    const it = items.find(i => i.id === id);
    if (it) { it.qty = Math.min(qty, 99); _save(items); _updateAllBadges(); }
    return items;
  };

  const total = () => _get().reduce((s, i) => s + i.price * i.qty, 0);
  const count = () => _get().reduce((s, i) => s + i.qty, 0);
  const clear = () => { _save([]); _updateAllBadges(); };

  // Update EVERY badge on the page (desktop + mobile)
  const _updateAllBadges = () => {
    const n = count();
    // Desktop badge
    document.querySelectorAll('.cart-badge').forEach(b => {
      b.textContent = n;
      const hide = n === 0;
      b.classList.toggle('hidden', hide);
      if (!hide) { b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop'); }
    });
    // Mobile cart row
    const mbBadge = document.getElementById('mobileCartBadge');
    if (mbBadge) { mbBadge.textContent = n; mbBadge.style.display = n > 0 ? '' : 'none'; }
    const mbCount = document.getElementById('mobileCartCount');
    if (mbCount) mbCount.textContent = n > 0 ? `${n} item${n > 1 ? 's' : ''}` : '';
  };

  const updateBadge = _updateAllBadges; // public alias
  return { get, add, remove, setQty, total, count, clear, updateBadge };
})();

/* ═══════════════════════════════════════
   TOAST
═══════════════════════════════════════ */
const Toast = (() => {
  const _wrap = () => {
    let w = document.getElementById('toastWrap');
    if (!w) { w = document.createElement('div'); w.id = 'toastWrap'; w.className = 'toast-wrap'; document.body.appendChild(w); }
    return w;
  };
  const show = (msg, type = '', icon = '') => {
    const wrap = _wrap();
    const t = document.createElement('div');
    t.className = `toast${type ? ' toast--' + type : ''}`;
    t.innerHTML = `${icon ? `<span class="toast__icon">${icon}</span>` : ''}<span>${msg}</span><button class="toast__close" aria-label="Close">✕</button>`;
    t.querySelector('.toast__close').onclick = () => dismiss(t);
    wrap.appendChild(t);
    const timer = setTimeout(() => dismiss(t), 3400);
    t._timer = timer;
  };
  const dismiss = (t) => {
    clearTimeout(t._timer);
    t.classList.add('toast--out');
    setTimeout(() => t.remove(), 300);
  };
  const success = (m) => show(m, 'success', '✓');
  const error   = (m) => show(m, 'error',   '✕');
  const info    = (m) => show(m, '',        'ℹ');
  return { show, success, error, info };
})();

/* ═══════════════════════════════════════
   NAV
═══════════════════════════════════════ */
(function initNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;

  // Scroll shadow
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Active link by data-page
  const page = document.body.dataset.page || '';
  document.querySelectorAll('[data-nav]').forEach(l => l.classList.toggle('active', l.dataset.nav === page));

  // Badge init
  Cart.updateBadge();

  // Desktop cart icon → cart page
  document.getElementById('cartBtn')?.addEventListener('click', () => location.href = 'cart.html');

  // Burger + mobile menu
  const burger = document.getElementById('navBurger');
  const mobile = document.getElementById('navMobile');
  if (burger && mobile) {
    const open  = () => { mobile.classList.add('open');    burger.classList.add('open');    burger.setAttribute('aria-expanded','true');  mobile.setAttribute('aria-hidden','false'); document.body.style.overflow = 'hidden'; };
    const close = () => { mobile.classList.remove('open'); burger.classList.remove('open'); burger.setAttribute('aria-expanded','false'); mobile.setAttribute('aria-hidden','true');  document.body.style.overflow = ''; };
    const toggle = () => mobile.classList.contains('open') ? close() : open();
    burger.addEventListener('click', toggle);
    document.addEventListener('click', e => { if (mobile.classList.contains('open') && !burger.contains(e.target) && !mobile.contains(e.target)) close(); });
    mobile.querySelectorAll('a, .nav__mobile-link').forEach(a => a.addEventListener('click', close));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
    // Mobile cart link
    document.getElementById('mobileCartLink')?.addEventListener('click', () => { close(); location.href = 'cart.html'; });
  }

  // Search toggle
  const stBtn = document.getElementById('searchToggle');
  const sBox  = document.getElementById('searchBox');
  const sInput = document.getElementById('searchInput');
  if (stBtn && sBox) {
    stBtn.addEventListener('click', e => {
      e.stopPropagation();
      const isOpen = sBox.classList.toggle('open');
      if (isOpen && sInput) setTimeout(() => sInput.focus(), 40);
    });
    document.addEventListener('click', e => { if (!sBox.contains(e.target) && !stBtn.contains(e.target)) sBox.classList.remove('open'); });
    sInput?.addEventListener('keydown', e => {
      if (e.key === 'Enter' && sInput.value.trim()) location.href = `search.html?q=${encodeURIComponent(sInput.value.trim())}`;
      if (e.key === 'Escape') sBox.classList.remove('open');
    });
  }
})();

/* ═══════════════════════════════════════
   SMOOTH SCROLL
═══════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1); if (!id) return;
    const el = document.getElementById(id); if (!el) return;
    e.preventDefault();
    const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 64;
    window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - navH - 12, behavior: 'smooth' });
  });
});

/* ═══════════════════════════════════════
   SCROLL REVEAL
═══════════════════════════════════════ */
(function initReveal() {
  const els = document.querySelectorAll('.reveal,.reveal-left,.reveal-right');
  if (!els.length) return;
  if (window.matchMedia('(prefers-reduced-motion:reduce)').matches) { els.forEach(el => el.classList.add('visible')); return; }
  const io = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } }), { threshold: 0.1, rootMargin: '0px 0px -28px 0px' });
  els.forEach(el => io.observe(el));
})();

/* ═══════════════════════════════════════
   TICKER
═══════════════════════════════════════ */
(function() {
  const ticker = document.querySelector('.ticker');
  if (!ticker) return;
  const tracks = ticker.querySelectorAll('.ticker__track');
  ticker.addEventListener('mouseenter', () => tracks.forEach(t => t.style.animationPlayState = 'paused'));
  ticker.addEventListener('mouseleave', () => tracks.forEach(t => t.style.animationPlayState = ''));
})();

/* ═══════════════════════════════════════
   SHARED: BUILD SHOP CARD
═══════════════════════════════════════ */
function buildShopCard(p, i = 0) {
  const out = !p.inStock;
  return `
    <article class="shop-card reveal" style="--delay:${i*.06}s" data-category="${p.category}">
      <div class="shop-card__img-wrap">
        <a href="product.html?id=${p.id}"><img src="${p.img}" alt="${p.name}" loading="lazy" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22400%22><rect width=%22400%22 height=%22400%22 fill=%22%23fdf0f4%22/><text x=%22200%22 y=%22210%22 text-anchor=%22middle%22 font-size=%2260%22>💎</text></svg>'" /></a>
        ${out ? '<span class="shop-card__badge shop-card__badge--out">Sold Out</span>' : ''}
        <button class="shop-card__wishlist" aria-label="Wishlist" data-wid="${p.id}">♡</button>
      </div>
      <div class="shop-card__body">
        <h3><a href="product.html?id=${p.id}">${p.name}</a></h3>
        <p class="shop-card__tag">${p.tag || ''}</p>
        <strong class="shop-card__price">₦${p.price.toLocaleString()}</strong>
        <div class="shop-card__actions">
          <a href="https://wa.me/2348157334619?text=Hi%2C%20I%27d%20like%20to%20order%20${encodeURIComponent(p.name)}%20-%20%E2%82%A6${p.price.toLocaleString()}" class="btn btn--plum btn--sm" target="_blank" rel="noopener"${out ? ' tabindex="-1" style="opacity:.5;pointer-events:none"' : ''}>Order via WA</a>
          <button class="shop-card__cart-btn" aria-label="Add to cart" data-id="${p.id}" data-name="${p.name}" data-price="${p.price}" data-img="${p.img}"${out ? ' disabled' : ''}>
            <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          </button>
        </div>
      </div>
    </article>`;
}

function attachCardHandlers(container) {
  // Cart buttons
  container.querySelectorAll('.shop-card__cart-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const { id, name, price, img } = btn.dataset;
      Cart.add({ id, name, price: +price, img });
      Toast.success(`${name} added to cart`);
      const orig = btn.innerHTML;
      btn.innerHTML = '✓'; btn.style.color = 'var(--ok)'; btn.style.borderColor = 'var(--ok)';
      setTimeout(() => { btn.innerHTML = orig; btn.style.color = ''; btn.style.borderColor = ''; }, 1600);
    });
  });
  // Wishlist
  container.querySelectorAll('.shop-card__wishlist').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('active');
      btn.textContent = btn.classList.contains('active') ? '♥' : '♡';
    });
  });
  // Re-run reveal
  const io = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } }), { threshold: 0.08 });
  container.querySelectorAll('.reveal').forEach(el => io.observe(el));
}

/* ═══════════════════════════════════════
   HOMEPAGE
═══════════════════════════════════════ */
(function initHome() {
  if (document.body.dataset.page !== 'home') return;
  const grid = document.getElementById('featuredGrid');
  if (!grid || !window.AnnyshubData) return;
  const products = AnnyshubData.getFeatured();
  if (!products.length) { grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:var(--muted);padding:40px">No featured products yet.</p>'; return; }
  grid.innerHTML = products.map((p, i) => `
    <article class="product-card reveal" style="--delay:${i*.08}s">
      <div class="product-card__img-wrap">
        <img src="${p.img}" alt="${p.name}" loading="lazy" />
        <div class="product-card__hover">
          <a href="product.html?id=${p.id}" class="btn btn--plum btn--sm">View Details</a>
        </div>
      </div>
      <div class="product-card__body">
        <h3 class="product-card__name"><a href="product.html?id=${p.id}" style="color:inherit">${p.name}</a></h3>
        <p class="product-card__tag">${p.tag}</p>
        <strong class="product-card__price">₦${p.price.toLocaleString()}</strong>
      </div>
    </article>`).join('');
  const io = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } }), { threshold: 0.1 });
  grid.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // Homepage review carousel
  const rGrid = document.getElementById('reviewsGrid');
  if (rGrid && window.AnnyshubData) {
    const all = AnnyshubData.getReviews().filter(r => r.status === 'approved').slice(0, 3);
    rGrid.innerHTML = all.map((r, i) => `
      <div class="review-card reveal" style="--delay:${i*.08}s">
        <div class="review-card__stars">${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}</div>
        <p>"${r.text}"</p>
        <div class="review-card__author">
          <div class="avatar">${r.author.charAt(0)}</div>
          <div class="review-card__info"><strong>${r.author}</strong><span>${r.location}</span></div>
        </div>
      </div>`).join('');
    const io2 = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io2.unobserve(e.target); } }), { threshold: 0.1 });
    rGrid.querySelectorAll('.reveal').forEach(el => io2.observe(el));
  }
})();

/* ═══════════════════════════════════════
   COLLECTIONS PAGE
═══════════════════════════════════════ */
(function initCollections() {
  if (document.body.dataset.page !== 'collections') return;
  if (!window.AnnyshubData) return;

  const renderSection = (gridId, cat, limit = 4) => {
    const el = document.getElementById(gridId);
    if (!el) return;
    const products = AnnyshubData.getByCategory(cat).slice(0, limit);
    el.innerHTML = products.length ? products.map(buildShopCard).join('') : '<p style="color:var(--muted);font-size:14px">No products in this category yet.</p>';
    attachCardHandlers(el);
  };

  renderSection('necklacesGrid', 'necklace');
  renderSection('watchesGrid',   'watch');
  renderSection('braceletsGrid', 'bracelet');
  renderSection('setsGrid',      'set');
  renderSection('combosGrid',    'combo');

  // Also render any custom categories
  if (AnnyshubData.getCats) {
    AnnyshubData.getCats().forEach(cat => {
      const dynGrid = document.getElementById(`dynGrid_${cat.id}`);
      if (dynGrid) { dynGrid.innerHTML = AnnyshubData.getByCategory(cat.id).slice(0,4).map(buildShopCard).join(''); attachCardHandlers(dynGrid); }
    });
  }

  // Filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      document.querySelectorAll('.coll-section').forEach(s => {
        s.style.display = (f === 'all' || s.dataset.category === f) ? '' : 'none';
      });
    });
  });
})();

/* ═══════════════════════════════════════
   CATEGORY PAGE
═══════════════════════════════════════ */
(function initCategoryPage() {
  const catMap = { necklaces:'necklace', bracelets:'bracelet', wristwatches:'watch', sets:'set', combos:'combo' };
  const page = document.body.dataset.page;
  const cat  = catMap[page];
  if (!cat || !window.AnnyshubData) return;

  const grid  = document.getElementById('categoryGrid');
  const count = document.getElementById('productCount');
  const sort  = document.getElementById('sortSelect');
  if (!grid) return;

  let base = AnnyshubData.getByCategory(cat);

  const render = () => {
    let list = [...base];
    const sv = sort?.value || 'default';
    if (sv === 'price-asc')  list.sort((a,b) => a.price - b.price);
    if (sv === 'price-desc') list.sort((a,b) => b.price - a.price);
    if (sv === 'name')       list.sort((a,b) => a.name.localeCompare(b.name));
    grid.innerHTML = list.length ? list.map(buildShopCard).join('') : '<p style="grid-column:1/-1;text-align:center;padding:48px;color:var(--muted)">No products found.</p>';
    if (count) count.textContent = `${list.length} product${list.length !== 1 ? 's' : ''}`;
    attachCardHandlers(grid);
  };

  render();
  sort?.addEventListener('change', render);
})();

/* ═══════════════════════════════════════
   PRODUCT PAGE
═══════════════════════════════════════ */
(function initProduct() {
  if (document.body.dataset.page !== 'product') return;
  if (!window.AnnyshubData) return;

  const params  = new URLSearchParams(location.search);
  const id      = params.get('id');
  const product = id ? AnnyshubData.getById(id) : null;
  const root    = document.getElementById('productRoot');
  if (!root) return;

  if (!product) {
    root.innerHTML = `<div class="container" style="padding-block:80px;text-align:center"><p style="font-size:48px">💎</p><h2 style="font-family:var(--font-d);font-size:28px;margin:12px 0 8px;color:var(--dark)">Product not found</h2><p style="color:var(--muted);margin-bottom:24px">This product may have been removed.</p><a href="collections.html" class="btn btn--plum">Browse Collections</a></div>`;
    return;
  }

  // Breadcrumb
  const bc = document.getElementById('breadcrumb');
  if (bc) bc.innerHTML = `<a href="index.html">Home</a><span>›</span><a href="collections.html">Collections</a><span>›</span><span>${product.name}</span>`;

  // Page title
  document.title = `${product.name} — Annyshub`;

  root.innerHTML = `
    <div class="container">
      <div class="product-detail__grid">
        <div class="animate-fadein">
          <div class="product-detail__main-img" id="mainImg"><img src="${product.img}" alt="${product.name}" id="mainImgEl" /></div>
          <div class="product-detail__thumbs" id="thumbs">
            <div class="product-detail__thumb active" data-src="${product.img}"><img src="${product.img}" alt="View 1" /></div>
            <div class="product-detail__thumb" data-src="https://images.unsplash.com/photo-1611107419963-b14ab5e47a02?w=300&q=70"><img src="https://images.unsplash.com/photo-1611107419963-b14ab5e47a02?w=300&q=70" alt="View 2" /></div>
            <div class="product-detail__thumb" data-src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=300&q=70"><img src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=300&q=70" alt="View 3" /></div>
          </div>
        </div>
        <div class="product-detail__info animate-fadein-delay">
          <h1 class="product-detail__name">${product.name}</h1>
          <div class="product-detail__price">₦${product.price.toLocaleString()}</div>
          <div class="product-detail__rating">
            <span class="stars-display">${'★'.repeat(product.rating||4)}${'☆'.repeat(5-(product.rating||4))}</span>
            <span class="product-detail__review-count" id="reviewCountEl">${product.reviews||0} review${(product.reviews||0)!==1?'s':''}</span>
          </div>
          <div class="product-detail__divider"></div>
          <p class="product-detail__desc">${product.description||''}</p>
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            <span class="product-detail__tag-badge">✓ ${product.tag||'Non Tarnish'}</span>
            ${product.inStock ? '<span class="product-detail__tag-badge">✓ In Stock</span>' : '<span class="product-detail__tag-badge" style="background:#fdecea;color:var(--err)">Out of Stock</span>'}
          </div>
          <div class="product-detail__actions">
            <a href="https://wa.me/2348157334619?text=Hi%2C%20I%27d%20like%20to%20order%20${encodeURIComponent(product.name)}%20-%20%E2%82%A6${product.price.toLocaleString()}" class="btn btn--plum" target="_blank" rel="noopener">Order via WhatsApp</a>
            <button class="btn btn--outline" id="addToCartBtn"${!product.inStock?' disabled':''}>Add to Cart</button>
          </div>
        </div>
      </div>
    </div>`;

  // Thumb switcher
  root.querySelectorAll('.product-detail__thumb').forEach(th => {
    th.addEventListener('click', () => {
      root.querySelectorAll('.product-detail__thumb').forEach(t => t.classList.remove('active'));
      th.classList.add('active');
      const img = document.getElementById('mainImgEl');
      if (img) { img.style.opacity = '0'; setTimeout(() => { img.src = th.dataset.src; img.style.opacity = '1'; }, 140); }
    });
  });

  // Add to cart
  document.getElementById('addToCartBtn')?.addEventListener('click', () => {
    Cart.add({ id: product.id, name: product.name, price: product.price, img: product.img });
    Toast.success(`${product.name} added to cart`);
    const btn = document.getElementById('addToCartBtn');
    if (btn) { btn.textContent = '✓ Added!'; btn.disabled = true; setTimeout(() => { btn.textContent = 'Add to Cart'; btn.disabled = false; }, 1800); }
  });

  // Related
  const relGrid = document.getElementById('relatedGrid');
  if (relGrid && window.AnnyshubData) {
    const related = AnnyshubData.getByCategory(product.category).filter(p => p.id !== product.id).slice(0, 3);
    relGrid.innerHTML = related.map(buildShopCard).join('');
    attachCardHandlers(relGrid);
  }

  // Product reviews
  renderProductReviews(product.id);
})();

/* ═══════════════════════════════════════
   PRODUCT REVIEWS (customer-facing)
═══════════════════════════════════════ */
function renderProductReviews(productId) {
  const container = document.getElementById('productReviews');
  if (!container || !window.AnnyshubData) return;

  const approved = AnnyshubData.getApprovedReviews(productId);
  const reviewsHtml = approved.length
    ? approved.map(r => `
        <div class="review-card" style="margin-bottom:0">
          <div class="review-card__stars">${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}</div>
          <p>"${r.text}"</p>
          <div class="review-card__author">
            <div class="avatar">${r.author.charAt(0)}</div>
            <div class="review-card__info"><strong>${r.author}</strong><span>${r.location} · ${r.date}</span></div>
          </div>
        </div>`).join('')
    : '<p style="color:var(--muted);font-size:14px;grid-column:1/-1">No reviews yet. Be the first to review this product!</p>';

  container.innerHTML = `
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:18px;margin-bottom:36px">${reviewsHtml}</div>
    <div class="review-form-wrap">
      <h3>Leave a Review</h3>
      <form id="reviewForm" novalidate>
        <div class="form-group">
          <label class="form-label">Your Rating</label>
          <div class="star-picker" id="starPicker" role="radiogroup">
            ${[1,2,3,4,5].map(n => `<button type="button" data-star="${n}" aria-label="${n} star${n>1?'s':''}" title="${n} star${n>1?'s':''}">★</button>`).join('')}
          </div>
          <input type="hidden" id="reviewRating" value="0" />
        </div>
        <div class="form-group">
          <label class="form-label" for="reviewName">Your Name</label>
          <input class="form-input" type="text" id="reviewName" placeholder="e.g. Amaka O." required />
        </div>
        <div class="form-group">
          <label class="form-label" for="reviewLocation">Location</label>
          <input class="form-input" type="text" id="reviewLocation" placeholder="e.g. Lagos" />
        </div>
        <div class="form-group">
          <label class="form-label" for="reviewText">Your Review</label>
          <textarea class="form-textarea" id="reviewText" placeholder="Tell us about your experience…" required></textarea>
        </div>
        <button type="submit" class="btn btn--plum">Submit Review</button>
        <p class="review-pending-note">Your review will be visible after approval.</p>
      </form>
    </div>`;

  // Star picker
  let selectedStar = 0;
  const stars = container.querySelectorAll('.star-picker button');
  const ratingInput = document.getElementById('reviewRating');
  const highlight = (n) => stars.forEach((s, i) => s.classList.toggle('selected', i < n));

  stars.forEach((s, i) => {
    s.addEventListener('mouseenter', () => highlight(i + 1));
    s.addEventListener('mouseleave', () => highlight(selectedStar));
    s.addEventListener('click', () => { selectedStar = i + 1; ratingInput.value = selectedStar; highlight(selectedStar); });
  });

  // Form submit
  document.getElementById('reviewForm')?.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('reviewName').value.trim();
    const text = document.getElementById('reviewText').value.trim();
    const rating = +ratingInput.value;
    if (!name)   { Toast.error('Please enter your name'); return; }
    if (!text)   { Toast.error('Please write your review'); return; }
    if (!rating) { Toast.error('Please select a star rating'); return; }
    AnnyshubData.addReview({ productId, author: name, location: document.getElementById('reviewLocation').value.trim() || 'Nigeria', rating, text });
    Toast.success('Review submitted! It will appear after approval.');
    document.getElementById('reviewForm').reset();
    selectedStar = 0; highlight(0); ratingInput.value = 0;
  });
}

/* ═══════════════════════════════════════
   CART PAGE
═══════════════════════════════════════ */
(function initCart() {
  if (document.body.dataset.page !== 'cart') return;
  const itemsEl   = document.getElementById('cartItems');
  const summaryEl = document.getElementById('orderSummary');
  if (!itemsEl || !summaryEl) return;

  const render = () => {
    const items = Cart.get();
    Cart.updateBadge();

    if (!items.length) {
      itemsEl.innerHTML = `<div class="cart-empty"><div class="cart-empty__icon">🛍️</div><h2>Your cart is empty</h2><p>Browse our collections and add something beautiful.</p><a href="collections.html" class="btn btn--plum">Browse Collections</a></div>`;
      summaryEl.innerHTML = '';
      return;
    }

    itemsEl.innerHTML = `<div class="cart-items">${items.map(it => `
      <div class="cart-item">
        <div class="cart-item__img"><img src="${it.img}" alt="${it.name}" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2284%22 height=%2284%22><rect width=%2284%22 height=%2284%22 fill=%22%23fdf0f4%22/><text x=%2242%22 y=%2252%22 text-anchor=%22middle%22 font-size=%2230%22>💎</text></svg>'" /></div>
        <div class="cart-item__main">
          <div class="cart-item__name">${it.name}</div>
          <div class="cart-item__price">₦${(it.price * it.qty).toLocaleString()}</div>
          <div class="cart-item__controls">
            <div class="qty-control">
              <button class="qty-btn" data-action="dec" data-id="${it.id}" aria-label="Decrease">−</button>
              <div class="qty-display">${it.qty}</div>
              <button class="qty-btn" data-action="inc" data-id="${it.id}" aria-label="Increase">+</button>
            </div>
            <button class="cart-item__delete" data-action="remove" data-id="${it.id}" aria-label="Remove">
              <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 6h18M19 6l-1 14H6L5 6M8 6V4h8v2"/></svg>
            </button>
          </div>
        </div>
      </div>`).join('')}</div>`;

    const total = Cart.total();
    summaryEl.innerHTML = `
      <div class="order-summary">
        <h2>Order Summary</h2>
        <div class="order-summary__row"><span>Items (${Cart.count()})</span><span>₦${total.toLocaleString()}</span></div>
        <div class="order-summary__row"><span>Delivery</span><span style="color:var(--ok);font-weight:600">Confirmed via WhatsApp</span></div>
        <div class="order-summary__row order-summary__row--total"><span>Total</span><span>₦${total.toLocaleString()}</span></div>
        <a href="${buildWaMsg()}" class="btn btn--plum order-summary__wa" target="_blank" rel="noopener">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.121.554 4.11 1.523 5.837L0 24l6.326-1.501A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.659-.5-5.192-1.375l-.371-.22-3.754.89.944-3.648-.241-.381A9.96 9.96 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
          Order on WhatsApp
        </a>
        <p class="order-summary__note">We'll confirm your order, give you the full price including delivery, and keep you updated every step of the way.</p>
      </div>`;

    // Event delegation
    itemsEl.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', () => {
        const { action, id } = btn.dataset;
        if (action === 'remove') { Cart.remove(id); Toast.info('Item removed'); render(); }
        if (action === 'dec')    { Cart.setQty(id, (Cart.get().find(i => i.id===id)?.qty||1) - 1); render(); }
        if (action === 'inc')    { Cart.setQty(id, (Cart.get().find(i => i.id===id)?.qty||0) + 1); render(); }
      });
    });
  };

  const buildWaMsg = () => {
    const lines = Cart.get().map(i => `• ${i.name} x${i.qty} = ₦${(i.price*i.qty).toLocaleString()}`).join('%0A');
    return `https://wa.me/2348157334619?text=Hi%20Annyshub!%20I%27d%20like%20to%20order:%0A%0A${lines}%0A%0ATotal:%20%E2%82%A6${Cart.total().toLocaleString()}%0A%0APlease%20confirm%20delivery%20cost.`;
  };

  render();
})();

/* ═══════════════════════════════════════
   SEARCH PAGE
═══════════════════════════════════════ */
(function initSearch() {
  if (document.body.dataset.page !== 'search') return;
  if (!window.AnnyshubData) return;
  const q    = new URLSearchParams(location.search).get('q') || '';
  const grid = document.getElementById('searchGrid');
  const meta = document.getElementById('searchMeta');
  const h1   = document.getElementById('searchTitle');
  if (!grid) return;
  if (h1) h1.textContent = q ? `Results for "${q}"` : 'Search Products';
  if (!q) { grid.innerHTML = '<p style="color:var(--muted)">Enter a search term above to find products.</p>'; return; }
  const results = AnnyshubData.search(q);
  if (meta) meta.textContent = `${results.length} result${results.length!==1?'s':''} found`;
  grid.innerHTML = results.length
    ? results.map(buildShopCard).join('')
    : `<div style="grid-column:1/-1;text-align:center;padding:60px 0"><p style="font-size:40px">🔍</p><h3 style="font-family:var(--font-d);font-size:22px;margin:12px 0 8px;color:var(--dark)">No results found</h3><p style="color:var(--muted);margin-bottom:20px">Try a different search term.</p><a href="collections.html" class="btn btn--plum">Browse Collections</a></div>`;
  attachCardHandlers(grid);
})();

/* ═══════════════════════════════════════
   EXPORTS
═══════════════════════════════════════ */
window.Cart  = Cart;
window.Toast = Toast;
window.buildShopCard = buildShopCard;
window.attachCardHandlers = attachCardHandlers;