BEGIN;

CREATE TABLE
    categories (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid (),
        label text NOT NULL CHECK (char_length(label) BETWEEN 2 AND 40),
        sort_order integer NOT NULL DEFAULT 0,
        is_active boolean NOT NULL DEFAULT true,
        created_at timestamptz NOT NULL DEFAULT now ()
    );

-- "Network" and "network" count as the same label.
CREATE UNIQUE INDEX categories_label_unique_idx ON categories (lower(label));

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

COMMIT;