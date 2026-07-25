/**
 * Annyshub — Product Data Store
 * Central source of truth for all products.
 * localStorage key: 'annyshub_products'
 */

const AnnyshubData = (() => {

  const STORAGE_KEY = 'annyshub_products';

  const DEFAULT_PRODUCTS = [
    { id: 'p001', name: 'Zirconia Necklace',        category: 'necklace',  price: 4500, tag: '100% Non Tarnish', img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80', description: 'Simple and easy to wear Zirconia Necklace, super comfy and 100% Non Tarnish. Comes fully boxed.', featured: true,  inStock: true,  rating: 4, reviews: 5  },
    { id: 'p002', name: 'Love Tag Necklace',         category: 'necklace',  price: 7000, tag: '100% Non Tarnish', img: 'https://images.unsplash.com/photo-1611107419963-b14ab5e47a02?w=600&q=80', description: 'Elegant Love Tag Necklace with a delicate chain. Perfect for everyday wear or gifting.', featured: true,  inStock: true,  rating: 5, reviews: 8  },
    { id: 'p003', name: 'Rose Inspired Necklace',    category: 'necklace',  price: 8000, tag: '100% Non Tarnish', img: 'https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=600&q=80', description: 'Beautiful rose-inspired pendant necklace. A statement piece for any occasion.', featured: true,  inStock: true,  rating: 5, reviews: 12 },
    { id: 'p004', name: 'Love Inspired Necklace',    category: 'necklace',  price: 6500, tag: '100% Non Tarnish', img: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=600&q=80', description: 'Charming love-inspired necklace with a dainty pendant. Lightweight and comfortable.', featured: false, inStock: true,  rating: 4, reviews: 3  },
    { id: 'p005', name: 'Stoned Silver Necklace',    category: 'necklace',  price: 4000, tag: '100% Non Tarnish', img: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80', description: 'Stunning stone-set silver necklace. Hypoallergenic and safe for all skin types.', featured: false, inStock: true,  rating: 4, reviews: 6  },
    { id: 'p006', name: 'Floral Zirconia Necklace',  category: 'necklace',  price: 7000, tag: '100% Non Tarnish', img: 'https://images.unsplash.com/photo-1611107419963-b14ab5e47a02?w=600&q=80', description: 'Gorgeous floral zirconia necklace with sparkling stones. Comes in a gift box.', featured: false, inStock: true,  rating: 5, reviews: 9  },
    { id: 'p007', name: 'Butterfly Set',             category: 'set',       price: 4500, tag: '100% Non Tarnish', img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80', description: 'Adorable butterfly jewellery set. Includes necklace and matching earrings.', featured: false, inStock: true,  rating: 4, reviews: 7  },
    { id: 'p008', name: 'Noice Watch',               category: 'watch',     price: 9500, tag: '100% Non Tarnish', img: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600&q=80', description: 'Classic Noice wristwatch with an elegant dial and comfortable bracelet strap.', featured: true,  inStock: true,  rating: 5, reviews: 14 },
    { id: 'p009', name: 'Rolex Style Watch',         category: 'watch',     price: 8500, tag: '100% Non Tarnish', img: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=600&q=80', description: 'Luxury Rolex-style wristwatch. Eye-catching timepiece that complements any outfit.', featured: false, inStock: true,  rating: 4, reviews: 11 },
    { id: 'p010', name: 'Layered Gold Bracelet',     category: 'bracelet',  price: 8000, tag: '100% Non Tarnish', img: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=600&q=80', description: 'Beautiful layered gold bracelet that stacks perfectly. Adjustable fit.', featured: true,  inStock: true,  rating: 5, reviews: 18 },
    { id: 'p011', name: 'Chunky Bracelet 01',        category: 'bracelet',  price: 8000, tag: '100% Non Tarnish', img: 'https://images.unsplash.com/photo-1603974372039-adc49044b6bd?w=600&q=80', description: 'Bold chunky bracelet that makes a statement. Perfect for the confident woman.', featured: false, inStock: true,  rating: 4, reviews: 5  },
    { id: 'p012', name: 'Chunky Bracelet 02',        category: 'bracelet',  price: 7000, tag: '100% Non Tarnish', img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80', description: 'Chunky chain bracelet with unique link pattern. Durable and stylish.', featured: false, inStock: false, rating: 4, reviews: 2  },
    { id: 'p013', name: 'Zirconia Set',              category: 'set',       price: 4500, tag: '100% Non Tarnish', img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80', description: 'Complete Zirconia jewellery set. Necklace + earrings beautifully packaged.', featured: false, inStock: true,  rating: 5, reviews: 10 },
    { id: 'p014', name: 'Gold Combo Deal',           category: 'combo',     price: 8000, tag: '100% Non Tarnish', img: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=600&q=80', description: 'Amazing value combo — necklace + bracelet + earrings. Great gift option.', featured: false, inStock: true,  rating: 5, reviews: 21 },
    { id: 'p015', name: 'Stainless Steel Set',       category: 'set',       price: 5000, tag: '100% Non Tarnish', img: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80', description: 'Premium stainless steel jewellery set. Hypoallergenic and long-lasting.', featured: false, inStock: true,  rating: 4, reviews: 4  },
  ];

  function getAll() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_PRODUCTS;
    } catch { return DEFAULT_PRODUCTS; }
  }

  function saveAll(products) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(products)); } catch {}
  }

  function getById(id) {
    return getAll().find(p => p.id === id) || null;
  }

  function getByCategory(cat) {
    return getAll().filter(p => cat === 'all' || p.category === cat);
  }

  function getFeatured() {
    return getAll().filter(p => p.featured && p.inStock).slice(0, 3);
  }

  function add(product) {
    const products = getAll();
    product.id = 'p' + Date.now();
    products.unshift(product);
    saveAll(products);
    return product;
  }

  function update(id, changes) {
    const products = getAll();
    const idx = products.findIndex(p => p.id === id);
    if (idx === -1) return null;
    products[idx] = { ...products[idx], ...changes };
    saveAll(products);
    return products[idx];
  }

  function remove(id) {
    const products = getAll().filter(p => p.id !== id);
    saveAll(products);
  }

  function search(query) {
    const q = query.toLowerCase().trim();
    return getAll().filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  }

  function resetToDefaults() {
    saveAll(DEFAULT_PRODUCTS);
  }

  function getCategories() {
    return ['all', 'necklace', 'bracelet', 'watch', 'set', 'combo'];
  }

  return { getAll, getById, getByCategory, getFeatured, add, update, remove, search, resetToDefaults, getCategories };
})();

window.AnnyshubData = AnnyshubData;