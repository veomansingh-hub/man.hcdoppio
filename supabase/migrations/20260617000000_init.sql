CREATE TABLE menu_items (
  id BIGINT PRIMARY KEY,
  name TEXT,
  category TEXT,
  price NUMERIC,
  stock TEXT,
  available BOOLEAN
);

CREATE TABLE inventory (
  id BIGINT PRIMARY KEY,
  ingredient TEXT,
  category TEXT,
  "inStock" TEXT,
  "minLevel" TEXT,
  "unitCost" TEXT,
  status TEXT
);

CREATE TABLE sales (
  id BIGINT PRIMARY KEY,
  "orderNumber" TEXT,
  date TIMESTAMP,
  total NUMERIC,
  tax NUMERIC,
  method TEXT,
  items JSONB
);
