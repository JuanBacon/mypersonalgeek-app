-- Extra RLS tests for users, categories and attachments.
-- One transaction, rolled back at the end. Run WITHOUT -v ON_ERROR_STOP.

SELECT id AS admin_id     FROM public.users WHERE user_role = 'admin'     ORDER BY created_at LIMIT 1 \gset
SELECT id AS requester_id FROM public.users WHERE user_role = 'requester' ORDER BY created_at LIMIT 1 \gset
SELECT id AS category_id  FROM public.categories WHERE is_active ORDER BY sort_order LIMIT 1 \gset

BEGIN;

-- Fixtures, created with full privileges before any test switches role.
INSERT INTO tickets (id, created_by, category_id, title, description) VALUES
  ('00000000-0000-0000-0000-00000000f001', :'admin_id',     :'category_id', 'Admin own ticket',     'Fixture ticket owned by the admin.'),
  ('00000000-0000-0000-0000-00000000f002', :'requester_id', :'category_id', 'Requester own ticket', 'Fixture ticket owned by the requester.');

INSERT INTO categories (id, label, is_active) VALUES
  ('00000000-0000-0000-0000-00000000c001', 'Inactive test category', false);

INSERT INTO attachments (ticket_id, uploaded_by, storage_path, original_name, mime_type, size_bytes) VALUES
  ('00000000-0000-0000-0000-00000000f001', :'admin_id',     'test/admin-ticket/a.png',     'admin-file.png',     'image/png', 1000),
  ('00000000-0000-0000-0000-00000000f002', :'requester_id', 'test/requester-ticket/b.png', 'requester-file.png', 'image/png', 1000);

\echo
\echo '=== TEST 12: requester sees only her own user row (expect 1 row)'
SAVEPOINT t12;
SELECT set_config('request.jwt.claims', json_build_object('sub', :'requester_id'::text, 'role', 'authenticated')::text, true);
SET LOCAL ROLE authenticated;
SELECT count(*) AS users_seen_by_requester FROM public.users;
ROLLBACK TO t12;

\echo
\echo '=== TEST 13: admin sees every user row (expect 2 rows)'
SAVEPOINT t13;
SELECT set_config('request.jwt.claims', json_build_object('sub', :'admin_id'::text, 'role', 'authenticated')::text, true);
SET LOCAL ROLE authenticated;
SELECT count(*) AS users_seen_by_admin FROM public.users;
ROLLBACK TO t13;

\echo
\echo '=== TEST 14: requester cannot create a category (expect row-level security error)'
SAVEPOINT t14;
SELECT set_config('request.jwt.claims', json_build_object('sub', :'requester_id'::text, 'role', 'authenticated')::text, true);
SET LOCAL ROLE authenticated;
INSERT INTO categories (label) VALUES ('Requester category');
ROLLBACK TO t14;

\echo
\echo '=== TEST 15: requester sees active categories but NOT the inactive one (expect no row named Inactive test category)'
SAVEPOINT t15;
SELECT set_config('request.jwt.claims', json_build_object('sub', :'requester_id'::text, 'role', 'authenticated')::text, true);
SET LOCAL ROLE authenticated;
SELECT label, is_active FROM categories ORDER BY label;
ROLLBACK TO t15;

\echo
\echo '=== TEST 16: admin sees the inactive category and can create one (expect 1, then 1 row returned)'
SAVEPOINT t16;
SELECT set_config('request.jwt.claims', json_build_object('sub', :'admin_id'::text, 'role', 'authenticated')::text, true);
SET LOCAL ROLE authenticated;
SELECT count(*) AS inactive_seen_by_admin FROM categories WHERE label = 'Inactive test category';
INSERT INTO categories (label) VALUES ('Admin created category') RETURNING label;
ROLLBACK TO t16;

\echo
\echo '=== TEST 17: requester sees only attachments of her own ticket (expect only requester-file.png)'
SAVEPOINT t17;
SELECT set_config('request.jwt.claims', json_build_object('sub', :'requester_id'::text, 'role', 'authenticated')::text, true);
SET LOCAL ROLE authenticated;
SELECT original_name FROM attachments ORDER BY original_name;
ROLLBACK TO t17;

\echo
\echo '=== TEST 18: requester cannot attach a file to the admin ticket (expect row-level security error)'
SAVEPOINT t18;
SELECT set_config('request.jwt.claims', json_build_object('sub', :'requester_id'::text, 'role', 'authenticated')::text, true);
SET LOCAL ROLE authenticated;
INSERT INTO attachments (ticket_id, uploaded_by, storage_path, original_name, mime_type, size_bytes)
  VALUES ('00000000-0000-0000-0000-00000000f001', :'requester_id', 'test/x/c.png', 'c.png', 'image/png', 1000);
ROLLBACK TO t18;

\echo
\echo '=== TEST 19: requester cannot attach a file in the admin name (expect row-level security error)'
SAVEPOINT t19;
SELECT set_config('request.jwt.claims', json_build_object('sub', :'requester_id'::text, 'role', 'authenticated')::text, true);
SET LOCAL ROLE authenticated;
INSERT INTO attachments (ticket_id, uploaded_by, storage_path, original_name, mime_type, size_bytes)
  VALUES ('00000000-0000-0000-0000-00000000f002', :'admin_id', 'test/x/d.png', 'd.png', 'image/png', 1000);
ROLLBACK TO t19;

\echo
\echo '=== TEST 20: requester can attach a file to her own ticket (expect 1 row)'
SAVEPOINT t20;
SELECT set_config('request.jwt.claims', json_build_object('sub', :'requester_id'::text, 'role', 'authenticated')::text, true);
SET LOCAL ROLE authenticated;
INSERT INTO attachments (ticket_id, uploaded_by, storage_path, original_name, mime_type, size_bytes)
  VALUES ('00000000-0000-0000-0000-00000000f002', :'requester_id', 'test/x/e.png', 'e.png', 'image/png', 1000)
  RETURNING original_name;
ROLLBACK TO t20;

ROLLBACK;