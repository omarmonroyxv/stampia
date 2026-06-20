-- Add production stage field for real-time order tracker
ALTER TABLE orders ADD COLUMN IF NOT EXISTS production_stage TEXT DEFAULT NULL;

-- Index for realtime subscriptions by user
CREATE INDEX IF NOT EXISTS orders_user_id_idx ON orders(user_id);

COMMENT ON COLUMN orders.production_stage IS
  'Internal production stage shown in customer tracker. Values: dtf_printing | dtf_pressing | packing | shipped_out';
