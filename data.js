/**
 * Annyshub — Central Data Store v4
 * Products · Categories · Reviews · Cart
 */
'use strict';

const AnnyshubData = (() => {
  const KEYS = {
    products:   'ann_products',
    categories: 'ann_categories',
    reviews:    'ann_reviews',
  };

  /* ── Default Categories ── */
  const DEFAULT_CATS = [
    { id: 'necklace',  label: 'Necklaces',    icon: '📿', page: 'necklaces.html'    },
    { id: 'bracelet',  label: 'Bracelets',    icon: '⌚', page: 'bracelets.html'    },
    { id: 'watch',     label: 'Wristwatches', icon: '🕐', page: 'wristwatches.html' },
    { id: 'set',       label: 'Sets',         icon: '✨', page: 'collections.html'  },
    { id: 'combo',     label: 'Combo Deals',  icon: '🎁', page: 'collections.html'  },
  ];

  /* ── Default Products ── */
  const DEFAULT_PRODUCTS = [
    { id:'p001', name:'Zirconia Necklace',       category:'necklace', price:4500, tag:'100% Non Tarnish', img:'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80', description:'Simple and easy to wear Zirconia Necklace, super comfy and 100% Non Tarnish. Comes fully boxed.', featured:true,  inStock:true,  rating:4, reviews:5  },
    { id:'p002', name:'Love Tag Necklace',        category:'necklace', price:7000, tag:'100% Non Tarnish', img:'https://images.unsplash.com/photo-1611107419963-b14ab5e47a02?w=600&q=80', description:'Elegant Love Tag Necklace with a delicate chain. Perfect for everyday wear or gifting.', featured:true,  inStock:true,  rating:5, reviews:8  },
    { id:'p003', name:'Rose Inspired Necklace',   category:'necklace', price:8000, tag:'100% Non Tarnish', img:'https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=600&q=80', description:'Beautiful rose-inspired pendant necklace. A statement piece for any occasion.', featured:true,  inStock:true,  rating:5, reviews:12 },
    { id:'p004', name:'Love Inspired Necklace',   category:'necklace', price:6500, tag:'100% Non Tarnish', img:'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=600&q=80', description:'Charming love-inspired necklace with a dainty pendant. Lightweight and comfortable.', featured:false, inStock:true,  rating:4, reviews:3  },
    { id:'p005', name:'Stoned Silver Necklace',   category:'necklace', price:4000, tag:'100% Non Tarnish', img:'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80', description:'Stunning stone-set silver necklace. Hypoallergenic and safe for all skin types.', featured:false, inStock:true,  rating:4, reviews:6  },
    { id:'p006', name:'Noice Watch',              category:'watch',    price:9500, tag:'100% Non Tarnish', img:'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600&q=80', description:'Classic Noice wristwatch with an elegant dial and comfortable bracelet strap.', featured:true,  inStock:true,  rating:5, reviews:14 },
    { id:'p007', name:'Rolex Style Watch',        category:'watch',    price:8500, tag:'100% Non Tarnish', img:'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=600&q=80', description:'Luxury Rolex-style wristwatch. Eye-catching timepiece that complements any outfit.', featured:false, inStock:true,  rating:4, reviews:11 },
    { id:'p008', name:'Layered Gold Bracelet',    category:'bracelet', price:8000, tag:'100% Non Tarnish', img:'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=600&q=80', description:'Beautiful layered gold bracelet that stacks perfectly. Adjustable fit.', featured:true,  inStock:true,  rating:5, reviews:18 },
    { id:'p009', name:'Chunky Bracelet 01',       category:'bracelet', price:8000, tag:'100% Non Tarnish', img:'https://images.unsplash.com/photo-1603974372039-adc49044b6bd?w=600&q=80', description:'Bold chunky bracelet that makes a statement. Perfect for the confident woman.', featured:false, inStock:true,  rating:4, reviews:5  },
    { id:'p010', name:'Chunky Bracelet 02',       category:'bracelet', price:7000, tag:'100% Non Tarnish', img:'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80', description:'Chunky chain bracelet with unique link pattern. Durable and stylish.', featured:false, inStock:false, rating:4, reviews:2  },
    { id:'p011', name:'Butterfly Set',            category:'set',      price:4500, tag:'100% Non Tarnish', img:'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80', description:'Adorable butterfly jewellery set. Includes necklace and matching earrings.', featured:false, inStock:true,  rating:4, reviews:7  },
    { id:'p012', name:'Gold Combo Deal',          category:'combo',    price:8000, tag:'100% Non Tarnish', img:'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=600&q=80', description:'Amazing value combo — necklace + bracelet + earrings. Great gift option.', featured:false, inStock:true,  rating:5, reviews:21 },
  ];

  /* ── Default Reviews ── */
  const DEFAULT_REVIEWS = [
    { id:'r001', productId:'p001', author:'Amaka E.A.',       location:'Lagos',    rating:5, text:'I was honestly surprised when my order arrived. The quality is even better than the pictures. Definitely ordering again!', status:'approved', date:'2026-05-10' },
    { id:'r002', productId:'p002', author:'Tosin A.',         location:'Osun',     rating:5, text:'My bracelet arrived exactly as shown and delivery was faster than I expected. Already recommended to friends.', status:'approved', date:'2026-05-14' },
    { id:'r003', productId:'p003', author:'Ewaolorun E.A.',   location:'Lagos',    rating:5, text:'This jewelry is too fine abeg 😭 I wore the set to a wedding and everybody kept asking where I got it from. Quality is 10/10.', status:'approved', date:'2026-06-01' },
    { id:'r004', productId:'p001', author:'Chidinma O.',      location:'Abuja',    rating:4, text:'Beautiful necklace, came well packaged. Would definitely buy again.', status:'pending', date:'2026-06-20' },
    { id:'r005', productId:'p006', author:'Funmilayo B.',     location:'Ibadan',   rating:5, text:'The watch is absolutely stunning. I get compliments everywhere I go!', status:'pending', date:'2026-07-01' },
  ];

  /* ── Helpers ── */
  const load  = (key, def) => { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : def; } catch { return def; } };
  const store = (key, val) => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} };

  /* ── Products ── */
  const getAll         = ()      => load(KEYS.products, DEFAULT_PRODUCTS);
  const saveAll        = (p)     => store(KEYS.products, p);
  const getById        = (id)    => getAll().find(p => p.id === id) || null;
  const getByCategory  = (cat)   => getAll().filter(p => cat === 'all' || p.category === cat);
  const getFeatured    = ()      => getAll().filter(p => p.featured && p.inStock).slice(0, 3);
  const search         = (q)     => { const s = q.toLowerCase(); return getAll().filter(p => p.name.toLowerCase().includes(s) || p.category.toLowerCase().includes(s) || (p.description||'').toLowerCase().includes(s)); };

  const addProduct = (data) => {
    const list = getAll();
    const prod = { ...data, id: 'p' + Date.now() };
    list.unshift(prod); saveAll(list); return prod;
  };

  const updateProduct = (id, changes) => {
    const list = getAll();
    const i = list.findIndex(p => p.id === id);
    if (i === -1) return null;
    list[i] = { ...list[i], ...changes };
    saveAll(list); return list[i];
  };

  const removeProduct = (id) => { saveAll(getAll().filter(p => p.id !== id)); };

  /* ── Categories ── */
  const getCats    = ()      => load(KEYS.categories, DEFAULT_CATS);
  const saveCats   = (c)     => store(KEYS.categories, c);
  const getCatById = (id)    => getCats().find(c => c.id === id);

  const addCat = (data) => {
    const list = getCats();
    if (list.find(c => c.id === data.id)) return null; // duplicate
    const cat = { ...data };
    list.push(cat); saveCats(list); return cat;
  };

  const updateCat = (id, changes) => {
    const list = getCats();
    const i = list.findIndex(c => c.id === id);
    if (i === -1) return null;
    list[i] = { ...list[i], ...changes };
    saveCats(list); return list[i];
  };

  const removeCat = (id) => {
    saveCats(getCats().filter(c => c.id !== id));
    // Move orphaned products to 'uncategorised'
    const prods = getAll().map(p => p.category === id ? { ...p, category: 'other' } : p);
    saveAll(prods);
  };

  /* ── Reviews ── */
  const getReviews         = ()          => load(KEYS.reviews, DEFAULT_REVIEWS);
  const saveReviews        = (r)         => store(KEYS.reviews, r);
  const getApprovedReviews = (productId) => getReviews().filter(r => r.productId === productId && r.status === 'approved');
  const getPendingReviews  = ()          => getReviews().filter(r => r.status === 'pending');

  const addReview = (data) => {
    const list = getReviews();
    const rev  = { ...data, id: 'r' + Date.now(), status: 'pending', date: new Date().toISOString().slice(0,10) };
    list.push(rev); saveReviews(list); return rev;
  };

  const approveReview = (id) => {
    const list = getReviews();
    const r = list.find(r => r.id === id);
    if (r) { r.status = 'approved'; saveReviews(list); }
  };

  const declineReview = (id) => {
    const list = getReviews();
    const r = list.find(r => r.id === id);
    if (r) { r.status = 'declined'; saveReviews(list); }
  };

  const deleteReview = (id) => { saveReviews(getReviews().filter(r => r.id !== id)); };

  /* ── Reset ── */
  const resetAll = () => {
    store(KEYS.products,   DEFAULT_PRODUCTS);
    store(KEYS.categories, DEFAULT_CATS);
    store(KEYS.reviews,    DEFAULT_REVIEWS);
  };

  return {
    getAll, getById, getByCategory, getFeatured, search,
    addProduct, updateProduct, removeProduct,
    getCats, getCatById, addCat, updateCat, removeCat,
    getReviews, getApprovedReviews, getPendingReviews,
    addReview, approveReview, declineReview, deleteReview,
    resetAll,
  };
})();

window.AnnyshubData = AnnyshubData;