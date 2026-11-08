BEGIN;

CREATE TABLE
    comments (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid (),
        ticket_id uuid NOT NULL REFERENCES tickets (id) ON DELETE CASCADE,
        author_id uuid NOT NULL REFERENCES users (id) ON DELETE RESTRICT,
        body text NOT NULL CHECK (char_length(body) BETWEEN 1 AND 5000),
        created_at timestamptz NOT NULL DEFAULT now ()
    );

CREATE INDEX comments_ticket_id_created_at_idx ON comments (ticket_id, created_at);

ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

COMMIT;