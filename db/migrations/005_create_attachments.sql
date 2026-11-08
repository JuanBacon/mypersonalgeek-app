BEGIN;

CREATE TABLE
    attachments (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid (),
        ticket_id uuid NOT NULL REFERENCES tickets (id) ON DELETE CASCADE,
        uploaded_by uuid NOT NULL REFERENCES users (id) ON DELETE RESTRICT,
        storage_path text NOT NULL UNIQUE,
        original_name text NOT NULL CHECK (char_length(original_name) BETWEEN 1 AND 255),
        mime_type text NOT NULL CHECK (
            mime_type IN (
                'image/png',
                'image/jpeg',
                'image/webp',
                'application/pdf',
                'text/plain'
            )
        ),
        size_bytes integer NOT NULL CHECK (
            size_bytes > 0
            AND size_bytes <= 5242880
        ),
        created_at timestamptz NOT NULL DEFAULT now ()
    );

CREATE INDEX attachments_ticket_id_idx ON attachments (ticket_id);

ALTER TABLE attachments ENABLE ROW LEVEL SECURITY;

COMMIT;