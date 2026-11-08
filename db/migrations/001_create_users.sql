BEGIN;

CREATE TABLE
    users (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid (),
        display_name text NOT NULL CHECK (char_length(display_name) BETWEEN 2 AND 30),
        user_role text NOT NULL DEFAULT 'requester' CHECK (user_role IN ('admin', 'requester')),
        created_at timestamptz NOT NULL DEFAULT now (),
        updated_at timestamptz NOT NULL DEFAULT now ()
    );

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

COMMIT;