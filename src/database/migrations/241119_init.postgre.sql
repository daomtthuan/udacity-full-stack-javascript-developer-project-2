CREATE TYPE ENTITY_STATUS AS ENUM ('active', 'inactive', 'deleted');

CREATE TABLE users (
  -- Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Data
  username VARCHAR(50) NOT NULL UNIQUE,
  password TEXT NOT NULL,
  name VARCHAR(100),
  email VARCHAR(100) NOT NULL UNIQUE,
  -- Trackable
  status ENTITY_STATUS NOT NULL DEFAULT 'active',
  created_by_user_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_by_user_id UUID REFERENCES users(id),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
  -- Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Data
  name VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  -- Trackable
  status ENTITY_STATUS NOT NULL DEFAULT 'active',
  created_by_user_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_by_user_id UUID REFERENCES users(id),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
  -- Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Data
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  -- Trackable
  status ENTITY_STATUS NOT NULL DEFAULT 'active',
  created_by_user_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_by_user_id UUID REFERENCES users(id),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE product_categories (
  -- Key
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, category_id),
  -- Trackable
  status ENTITY_STATUS NOT NULL DEFAULT 'active',
  created_by_user_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_by_user_id UUID REFERENCES users(id),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reviews (
  -- Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  product_id UUID NOT NULL REFERENCES products(id),
  -- Data
  rating INTEGER CHECK (
    rating >= 1
    AND rating <= 5
  ),
  comment TEXT,
  -- Trackable
  status ENTITY_STATUS NOT NULL DEFAULT 'active',
  created_by_user_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_by_user_id UUID REFERENCES users(id),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TYPE ORDER_STAGE AS ENUM (
  'created',
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'returned'
);

CREATE TABLE orders (
  -- Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  -- Data
  stage ORDER_STAGE NOT NULL DEFAULT 'created',
  -- Trackable
  status ENTITY_STATUS NOT NULL DEFAULT 'active',
  created_by_user_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_by_user_id UUID REFERENCES users(id),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
