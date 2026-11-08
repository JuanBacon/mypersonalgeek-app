BEGIN;

CREATE TABLE
    tickets (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid (),
        -- RESTRICT: a profile that has tickets cannot be deleted, so ticket history is not lost silently.
        created_by uuid NOT NULL REFERENCES users (id) ON DELETE RESTRICT,
        -- RESTRICT: categories are deactivated (is_active = false), never deleted while tickets use them.
        category_id uuid NOT NULL REFERENCES categories (id) ON DELETE RESTRICT,
        title text NOT NULL CHECK (char_length(title) BETWEEN 5 AND 100),
        description text NOT NULL CHECK (char_length(description) BETWEEN 10 AND 5000),
        priority text NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high')),
        status text NOT NULL DEFAULT 'open' CHECK (
            status IN (
                'open',
                'in_progress',
                'waiting_on_user',
                'resolved',
                'closed'
            )
        ),
        created_at timestamptz NOT NULL DEFAULT now (),
        updated_at timestamptz NOT NULL DEFAULT now ()
    );

CREATE INDEX tickets_created_by_idx ON tickets (created_by);

CREATE INDEX tickets_category_id_idx ON tickets (category_id);

CREATE INDEX tickets_status_idx ON tickets (status);

ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

COMMIT;