-- The categories table already exists in the database:
--   id SERIAL PRIMARY KEY, type VARCHAR(255) NOT NULL, name VARCHAR(255) NOT NULL

-- Link each product to a category (nullable so existing products keep working).
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS products_category_id_idx ON products (category_id);
