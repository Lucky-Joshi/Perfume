-- ============================================================================
--  ESSENCE AURA — Supabase SQL Schema
--  Run this in the Supabase SQL Editor (or `psql`) before starting the API.
--  The backend uses the SERVICE ROLE key, which bypasses Row Level Security,
--  so RLS is enabled as an extra safety layer for the anon key.
-- ============================================================================

create extension if not exists "uuid-ossp";

-- ----------------------------------------------------------------------------
-- users
-- ----------------------------------------------------------------------------
create table if not exists users (
  id              uuid primary key default uuid_generate_v4(),
  email           text not null unique,
  password_hash   text not null,
  role            text not null default 'user' check (role in ('user', 'admin')),
  status          text not null default 'active' check (status in ('active', 'suspended')),
  email_verified  boolean not null default false,
  verify_token    text,
  reset_password_token    text,
  reset_password_expires  timestamptz,
  refresh_token   text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

alter table users enable row level security;

-- ----------------------------------------------------------------------------
-- profiles (1:1 with users)
-- ----------------------------------------------------------------------------
create table if not exists profiles (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid not null unique references users(id) on delete cascade,
  first_name   text not null default '',
  last_name    text not null default '',
  phone        text not null default '',
  address      text not null default '',
  city         text not null default '',
  country      text not null default '',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

alter table profiles enable row level security;

-- ----------------------------------------------------------------------------
-- admins
-- ----------------------------------------------------------------------------
create table if not exists admins (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid not null unique references users(id) on delete cascade,
  display_name text not null default '',
  role_label   text not null default 'Super Admin',
  created_at   timestamptz not null default now()
);

alter table admins enable row level security;

-- ----------------------------------------------------------------------------
-- categories
-- ----------------------------------------------------------------------------
create table if not exists categories (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  slug        text not null unique,
  description text not null default '',
  image       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table categories enable row level security;

-- ----------------------------------------------------------------------------
-- products
-- ----------------------------------------------------------------------------
create table if not exists products (
  id               uuid primary key default uuid_generate_v4(),
  name             text not null,
  slug             text not null unique,
  description      text not null default '',
  price            numeric(10,2) not null default 0,
  discount_price   numeric(10,2) not null default 0,
  brand            text not null default 'Essence Aura',
  category_id      uuid references categories(id) on delete set null,
  gender           text not null default 'unisex' check (gender in ('men', 'women', 'unisex')),
  fragrance_family text not null default '',
  top_notes        jsonb not null default '[]',
  middle_notes     jsonb not null default '[]',
  base_notes       jsonb not null default '[]',
  sizes            jsonb not null default '["50ml","100ml"]',
  stock            integer not null default 0,
  images           jsonb not null default '[]',
  featured         boolean not null default false,
  trending         boolean not null default false,
  best_seller      boolean not null default false,
  rating           numeric(3,1) not null default 0,
  reviews_count    integer not null default 0,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

alter table products enable row level security;

-- ----------------------------------------------------------------------------
-- orders
-- ----------------------------------------------------------------------------
create table if not exists orders (
  id               text primary key,
  user_id          uuid not null references users(id) on delete cascade,
  status           text not null default 'pending'
                   check (status in ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  subtotal         numeric(10,2) not null default 0,
  shipping_cost    numeric(10,2) not null default 0,
  discount         numeric(10,2) not null default 0,
  total_amount     numeric(10,2) not null default 0,
  shipping_address text,
  shipping_city    text,
  shipping_country text,
  payment_method   text not null default 'cod',
  payment_status   text not null default 'pending' check (payment_status in ('pending', 'paid', 'failed', 'refunded')),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

alter table orders enable row level security;

-- ----------------------------------------------------------------------------
-- order_items
-- ----------------------------------------------------------------------------
create table if not exists order_items (
  id           uuid primary key default uuid_generate_v4(),
  order_id     text not null references orders(id) on delete cascade,
  product_id   uuid not null references products(id),
  variant      text not null default 'Standard',
  product_name text not null,
  unit_price   numeric(10,2) not null default 0,
  quantity     integer not null default 1,
  line_total   numeric(10,2) not null default 0,
  image        text,
  created_at   timestamptz not null default now()
);

alter table order_items enable row level security;

-- ----------------------------------------------------------------------------
-- cart
-- ----------------------------------------------------------------------------
create table if not exists cart (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references users(id) on delete cascade,
  product_id uuid not null references products(id) on delete cascade,
  size       text not null default 'Standard',
  quantity   integer not null default 1 check (quantity > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, product_id, size)
);

alter table cart enable row level security;

-- ----------------------------------------------------------------------------
-- wishlist
-- ----------------------------------------------------------------------------
create table if not exists wishlist (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references users(id) on delete cascade,
  product_id uuid not null references products(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, product_id)
);

alter table wishlist enable row level security;

-- ----------------------------------------------------------------------------
-- reviews
-- ----------------------------------------------------------------------------
create table if not exists reviews (
  id         uuid primary key default uuid_generate_v4(),
  product_id uuid not null references products(id) on delete cascade,
  user_id    uuid not null references users(id) on delete cascade,
  rating     integer not null check (rating between 1 and 5),
  title      text not null default '',
  comment    text not null default '',
  status     text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (product_id, user_id)
);

alter table reviews enable row level security;

-- ----------------------------------------------------------------------------
-- contact_messages
-- ----------------------------------------------------------------------------
create table if not exists contact_messages (
  id         uuid primary key default uuid_generate_v4(),
  name       text not null,
  email      text not null,
  phone      text not null default '',
  subject    text not null,
  message    text not null,
  is_read    boolean not null default false,
  read_at    timestamptz,
  created_at timestamptz not null default now()
);

alter table contact_messages enable row level security;

-- ----------------------------------------------------------------------------
-- newsletter
-- ----------------------------------------------------------------------------
create table if not exists newsletter (
  id         uuid primary key default uuid_generate_v4(),
  email      text not null unique,
  created_at timestamptz not null default now()
);

alter table newsletter enable row level security;

-- ----------------------------------------------------------------------------
-- settings (key/value store for the admin panel)
-- ----------------------------------------------------------------------------
create table if not exists settings (
  key        text primary key,
  value      text not null default '',
  updated_at timestamptz not null default now()
);

alter table settings enable row level security;

-- ----------------------------------------------------------------------------
-- activity_logs
-- ----------------------------------------------------------------------------
create table if not exists activity_logs (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references users(id) on delete set null,
  admin_id    uuid references admins(id) on delete set null,
  action      text not null,
  entity      text not null default '',
  entity_id   text,
  meta        jsonb,
  created_at  timestamptz not null default now()
);

alter table activity_logs enable row level security;

-- ----------------------------------------------------------------------------
-- token_blacklist (revoked refresh tokens)
-- ----------------------------------------------------------------------------
create table if not exists token_blacklist (
  token      text primary key,
  expires_at timestamptz not null default (now() + interval '7 days')
);

alter table token_blacklist enable row level security;

-- ============================================================================
--  updated_at trigger
-- ============================================================================
create or replace function set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_users_updated before update on users for each row execute function set_updated_at();
create trigger trg_profiles_updated before update on profiles for each row execute function set_updated_at();
create trigger trg_categories_updated before update on categories for each row execute function set_updated_at();
create trigger trg_products_updated before update on products for each row execute function set_updated_at();
create trigger trg_orders_updated before update on orders for each row execute function set_updated_at();
create trigger trg_cart_updated before update on cart for each row execute function set_updated_at();
create trigger trg_reviews_updated before update on reviews for each row execute function set_updated_at();

-- ============================================================================
--  Indexes
-- ============================================================================
create index if not exists idx_products_gender on products(gender);
create index if not exists idx_products_featured on products(featured);
create index if not exists idx_products_best_seller on products(best_seller);
create index if not exists idx_products_trending on products(trending);
create index if not exists idx_products_category on products(category_id);
create index if not exists idx_orders_user on orders(user_id);
create index if not exists idx_orders_status on orders(status);
create index if not exists idx_order_items_order on order_items(order_id);
create index if not exists idx_cart_user on cart(user_id);
create index if not exists idx_wishlist_user on wishlist(user_id);
create index if not exists idx_reviews_product on reviews(product_id);
create index if not exists idx_reviews_status on reviews(status);
create index if not exists idx_activity_created on activity_logs(created_at desc);
create index if not exists idx_users_verify_token on users(verify_token);
create index if not exists idx_users_reset_token on users(reset_password_token);

-- ============================================================================
--  catalog VIEW — flattened read model for products
-- ============================================================================
create or replace view catalog as
select
  p.id,
  p.name,
  p.slug,
  p.brand,
  c.name  as category_name,
  p.category_id,
  p.gender,
  p.fragrance_family,
  p.description,
  p.price,
  p.discount_price,
  case when p.discount_price > 0 and p.discount_price < p.price
       then round(100 - (p.discount_price / p.price) * 100) else 0 end as discount_percent,
  p.sizes,
  p.stock,
  p.images,
  p.top_notes,
  p.middle_notes,
  p.base_notes,
  p.featured,
  p.trending,
  p.best_seller,
  p.rating,
  p.reviews_count,
  p.created_at,
  p.updated_at
from products p
left join categories c on c.id = p.category_id;

-- ============================================================================
--  Seed: settings
-- ============================================================================
insert into settings (key, value) values
  ('store_name', 'Essence Aura'),
  ('store_tagline', 'Luxury in Every Drop'),
  ('support_email', 'support@essenceaura.com'),
  ('support_phone', '+1 (212) 555-0182'),
  ('currency', '$'),
  ('admin_notify_email', 'admin@essenceaura.com')
on conflict (key) do nothing;

-- ============================================================================
--  Seed: categories
-- ============================================================================
insert into categories (name, slug, description) values
  ('Eau de Parfum', 'eau-de-parfum', 'Intense, long-lasting fragrance with a high concentration of perfume oil.'),
  ('Eau de Toilette', 'eau-de-toilette', 'Fresh, lighter fragrance perfect for everyday wear.'),
  ('Oud & Intense', 'oud-and-intense', 'Bold oriental compositions built around rare agarwood.'),
  ('Floral', 'floral', 'Delicate feminine florals with rose, jasmine and peony.'),
  ('Woody & Earthy', 'woody-and-earthy', 'Grounded woody blends with sandalwood, vetiver and cedar.')
on conflict (slug) do nothing;