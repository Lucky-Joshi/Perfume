import 'dotenv/config';
import bcrypt from 'bcrypt';
import { supabase } from '../config/supabase.js';
import { slugify } from './slugify.js';

/**
 * Idempotent seed script.
 *   npm run seed
 *
 * 1. Creates the bootstrap admin user (from ADMIN_EMAIL / ADMIN_PASSWORD in .env).
 * 2. Seeds a full product catalog so the frontend renders immediately.
 */
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@essenceaura.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@12345';

const categories = [
  { slug: 'eau-de-parfum' },
  { slug: 'eau-de-toilette' },
  { slug: 'oud-and-intense' },
  { slug: 'floral' },
  { slug: 'woody-and-earthy' }
];

const products = [
  { name: 'Noir Absolute', brand: 'Essence Aura', gender: 'men', category: 'oud-and-intense', price: 189, discount: 0, stock: 40, featured: true, bestSeller: true, badge: 'Best Seller' },
  { name: 'Velvet Storm', brand: 'Essence Aura', gender: 'men', category: 'eau-de-toilette', price: 215, discount: 0, stock: 32, featured: true, trending: true, badge: 'New' },
  { name: 'Royal Oud', brand: 'Essence Aura', gender: 'men', category: 'oud-and-intense', price: 249, discount: 0, stock: 18, featured: true, bestSeller: true, badge: 'Premium' },
  { name: 'Urban Legend', brand: 'Essence Aura', gender: 'men', category: 'eau-de-toilette', price: 159, discount: 129, stock: 55, featured: true, trending: true },
  { name: 'Midnight Fox', brand: 'Essence Aura', gender: 'men', category: 'oud-and-intense', price: 175, discount: 0, stock: 28, trending: true },

  { name: 'Petal Whisper', brand: 'Essence Aura', gender: 'women', category: 'floral', price: 199, discount: 0, stock: 60, featured: true, bestSeller: true, badge: 'Best Seller' },
  { name: 'Golden Elixir', brand: 'Essence Aura', gender: 'women', category: 'eau-de-parfum', price: 265, discount: 0, stock: 22, featured: true, bestSeller: true, badge: 'Premium' },
  { name: 'Sweet Reverie', brand: 'Essence Aura', gender: 'women', category: 'eau-de-parfum', price: 169, discount: 149, stock: 45, featured: true, trending: true },
  { name: 'Crimson Bloom', brand: 'Essence Aura', gender: 'women', category: 'floral', price: 209, discount: 0, stock: 30, trending: true, badge: 'New' },
  { name: 'Crystal Dawn', brand: 'Essence Aura', gender: 'women', category: 'eau-de-toilette', price: 185, discount: 0, stock: 38 },

  { name: 'Sandalwood Serenity', brand: 'Essence Aura', gender: 'unisex', category: 'woody-and-earthy', price: 195, discount: 0, stock: 26, featured: true, bestSeller: true, badge: 'Best Seller' },
  { name: 'Amber Nights', brand: 'Essence Aura', gender: 'unisex', category: 'eau-de-parfum', price: 225, discount: 0, stock: 20, featured: true, trending: true },
  { name: 'Musk Nomad', brand: 'Essence Aura', gender: 'unisex', category: 'eau-de-toilette', price: 179, discount: 0, stock: 34, featured: true, trending: true },
  { name: 'Citrus Decree', brand: 'Essence Aura', gender: 'unisex', category: 'eau-de-toilette', price: 149, discount: 0, stock: 50, trending: true, badge: 'New' },
  { name: 'Oud Royale', brand: 'Essence Aura', gender: 'unisex', category: 'oud-and-intense', price: 289, discount: 0, stock: 12, bestSeller: true, badge: 'Premium' }
];

const images = {
  'Noir Absolute': 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&h=750&fit=crop',
  'Velvet Storm': 'https://images.unsplash.com/photo-1595535873420-a599195b3f4a?w=600&h=750&fit=crop',
  'Royal Oud': 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=600&h=750&fit=crop',
  'Urban Legend': 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=600&h=750&fit=crop',
  'Midnight Fox': 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&h=750&fit=crop',
  'Petal Whisper': 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&h=750&fit=crop&q=80&auto=format',
  'Golden Elixir': 'https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=600&h=750&fit=crop',
  'Sweet Reverie': 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=600&h=750&fit=crop',
  'Crimson Bloom': 'https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?w=600&h=750&fit=crop',
  'Crystal Dawn': 'https://images.unsplash.com/photo-1619994403073-2cec844b8e63?w=600&h=750&fit=crop',
  'Sandalwood Serenity': 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=600&h=750&fit=crop',
  'Amber Nights': 'https://images.unsplash.com/photo-1602028915047-37269d1a73f7?w=600&h=750&fit=crop',
  'Musk Nomad': 'https://images.unsplash.com/photo-1598605272254-16f0c0ecdfa5?w=600&h=750&fit=crop',
  'Citrus Decree': 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600&h=750&fit=crop',
  'Oud Royale': 'https://images.unsplash.com/photo-1557170334-a9632e77c6e4?w=600&h=750&fit=crop'
};

const notes = {
  'Noir Absolute': { top: ['Black Pepper', 'Bergamot', 'Cardamom'], mid: ['Leather', 'Violet Leaf', 'Geranium'], base: ['Oud Wood', 'Vetiver', 'Amber'] },
  'Velvet Storm': { top: ['Sea Salt', 'Lemon', 'Marine Accord'], mid: ['Driftwood', 'Lavender', 'Iris'], base: ['Musk', 'Sandalwood', 'Tonka Bean'] },
  'Royal Oud': { top: ['Saffron', 'Pink Pepper', 'Neroli'], mid: ['Oud', 'Rose', 'Jasmine'], base: ['Sandalwood', 'Patchouli', 'Benzoin'] },
  'Urban Legend': { top: ['Grapefruit', 'Basil', 'Ginger'], mid: ['Cedar', 'Clary Sage', 'Geranium'], base: ['Vetiver', 'Musk', 'Cedarwood'] },
  'Midnight Fox': { top: ['Bergamot', 'Black Currant', 'Anise'], mid: ['Tobacco', 'Plum', 'Cinnamon'], base: ['Vanilla', 'Dark Amber', 'Leather'] },
  'Petal Whisper': { top: ['Pink Pepper', 'Pear', 'Lychee'], mid: ['Bulgarian Rose', 'Peony', 'White Lily'], base: ['Musk', 'Cedarwood', 'Amber'] },
  'Golden Elixir': { top: ['Saffron', 'Bitter Orange', 'Mandarin'], mid: ['Jasmine Sambac', 'Ylang Ylang', 'Orange Blossom'], base: ['Sandalwood', 'Vanilla', 'White Musk'] },
  'Sweet Reverie': { top: ['Bergamot', 'Raspberry', 'Cotton Candy'], mid: ['Caramel', 'Praline', 'Iris'], base: ['Vanilla', 'Tonka Bean', 'Musk'] },
  'Crimson Bloom': { top: ['Red Berries', 'Dewy Melon', 'Aldehydes'], mid: ['Tuberose', 'Magnolia', 'Violet'], base: ['Patchouli', 'Sandalwood', 'Ambroxan'] },
  'Crystal Dawn': { top: ['Green Tea', 'Cucumber', 'Bergamot'], mid: ['Jasmine', 'Lily of the Valley', 'Peony'], base: ['White Musk', 'Cedar', 'Ambergris'] },
  'Sandalwood Serenity': { top: ['Bergamot', 'Cardamom', 'Grapefruit'], mid: ['Sandalwood', 'Cedar', 'Violet'], base: ['Vetiver', 'Musk', 'Amber'] },
  'Amber Nights': { top: ['Cinnamon', 'Pink Pepper', 'Orange'], mid: ['Amber', 'Labdanum', 'Myrrh'], base: ['Benzoin', 'Vanilla', 'Sandalwood'] },
  'Musk Nomad': { top: ['White Musk', 'Aldehydes', 'Bergamot'], mid: ['Cashmere Wood', 'Iris', 'Freesia'], base: ['Musk', 'Cedar', 'Patchouli'] },
  'Citrus Decree': { top: ['Sicilian Lemon', 'Blood Orange', 'Mandarin'], mid: ['Neroli', 'Petitgrain', 'Jasmine'], base: ['White Musk', 'Cedar', 'Ambrette'] },
  'Oud Royale': { top: ['Saffron', 'Damask Rose', 'Bergamot'], mid: ['Cambodian Oud', 'Leather', 'Incense'], base: ['Agarwood', 'Musk', 'Sandalwood'] }
};

async function seedAdmin() {
  const existing = await supabase.from('users').select('id').eq('email', ADMIN_EMAIL).maybeSingle();
  if (existing.data) {
    console.log('[seed] admin already exists:', ADMIN_EMAIL);
    return;
  }

  const hash = await bcrypt.hash(ADMIN_PASSWORD, 12);
  const { data: user, error } = await supabase
    .from('users')
    .insert({ email: ADMIN_EMAIL, password_hash: hash, role: 'admin', email_verified: true })
    .select('id')
    .single();

  if (error) throw error;

  await supabase.from('profiles').insert({
    user_id: user.id,
    first_name: 'Essence',
    last_name: 'Aura Admin'
  });

  await supabase.from('admins').insert({
    user_id: user.id,
    display_name: 'Essence Aura Admin',
    role_label: 'Super Admin'
  });

  console.log('[seed] admin created:', ADMIN_EMAIL);
}

async function seedProducts() {
  const { data: categories } = await supabase.from('categories').select('id, slug');
  const catMap = {};
  for (const c of categories) catMap[c.slug] = c.id;
  if (!categories.length) console.warn('[seed] no categories found — run schema.sql first');

  for (const p of products) {
    const slug = slugify(p.name);
    const { data: existing } = await supabase.from('products').select('id').eq('slug', slug).maybeSingle();
    if (existing) continue;

    const image = images[p.name];
    const n = notes[p.name];

    await supabase.from('products').insert({
      name: p.name,
      slug,
      description: `${p.name} — a signature ${p.gender} fragrance from Essence Aura, crafted with rare ingredients for an unforgettable sillage.`,
      price: p.price,
      discount_price: p.discount,
      brand: p.brand,
      category_id: catMap[p.category] || null,
      gender: p.gender,
      fragrance_family: p.category.replace(/-/g, ' '),
      top_notes: n.top,
      middle_notes: n.mid,
      base_notes: n.base,
      sizes: ['30ml', '50ml', '100ml'],
      stock: p.stock,
      images: [image],
      featured: p.featured,
      trending: p.trending,
      best_seller: p.bestSeller,
      rating: 4.7,
      reviews_count: 0
    });

    console.log('[seed] product:', p.name);
  }
}

async function main() {
  console.log('\n=== Seeding Essence Aura ===\n');
  await seedAdmin();
  await seedProducts();
  console.log('\n=== Seed complete ===\n');
}

main().catch((err) => {
  console.error('[seed] failed:', err.message || err);
  process.exit(1);
});