-- RLS tests. Everything runs inside one transaction that is rolled back at the end,
-- so no test data is kept. Run WITHOUT -v ON_ERROR_STOP, because several tests
-- are expected to produce errors.

SELECT id AS admin_id     FROM public.users WHERE user_role = 'admin'     ORDER BY created_at LIMIT 1 \gset
SELECT id AS requester_id FROM public.users WHERE user_role = 'requester' ORDER BY created_at LIMIT 1 \gset
SELECT id AS category_id  FROM public.categories WHERE is_active ORDER BY sort_order LIMIT 1 \gset

BEGIN;

-- Fixtures, created with full privileges before any test switches role.
INSERT INTO tickets (id, created_by, category_id, title, description) VALUES
  ('00000000-0000-0000-0000-00000000f001', :'admin_id',     :'category_id', 'Admin own ticket',     'Fixture ticket owned by the admin.'),
  ('00000000-0000-0000-0000-00000000f002', :'requester_id', :'category_id', 'Requester own ticket', 'Fixture ticket owned by the requester.');

INSERT INTO comments (ticket_id, author_id, body) VALUES
  ('00000000-0000-0000-0000-00000000f001', :'admin_id', 'Comment on the admin ticket.'),
  ('00000000-0000-0000-0000-00000000f002', :'admin_id', 'Admin reply on the requester ticket.');

\echo
\echo '=== TEST 1: not logged in sees nothing (expect 0 rows or permission denied)'
SAVEPOINT t1;
SET LOCAL ROLE anon;
SELECT count(*) AS tickets_seen_by_anon FROM tickets;
ROLLBACK TO t1;

\echo
\echo '=== TEST 2: requester sees only her own data (expect uid_matches = t, one ticket, one comment)'
SAVEPOINT t2;
SELECT set_config('request.jwt.claims', json_build_object('sub', :'requester_id'::text, 'role', 'authenticated')::text, true);
SET LOCAL ROLE authenticated;
SELECT auth.uid() = :'requester_id'::uuid AS uid_matches;
SELECT title FROM tickets ORDER BY title;
SELECT body FROM comments ORDER BY body;
ROLLBACK TO t2;

\echo
\echo '=== TEST 3: requester cannot create a ticket in the admin name (expect row-level security error)'
SAVEPOINT t3;
SELECT set_config('request.jwt.claims', json_build_object('sub', :'requester_id'::text, 'role', 'authenticated')::text, true);
SET LOCAL ROLE authenticated;
INSERT INTO tickets (created_by, category_id, title, description)
  VALUES (:'admin_id', :'category_id', 'Fake ticket as admin', 'Trying to create a ticket in the admin name.');
ROLLBACK TO t3;

\echo
\echo '=== TEST 4: requester cannot create an already resolved ticket (expect row-level security error)'
SAVEPOINT t4;
SELECT set_config('request.jwt.claims', json_build_object('sub', :'requester_id'::text, 'role', 'authenticated')::text, true);
SET LOCAL ROLE authenticated;
INSERT INTO tickets (created_by, category_id, title, description, status)
  VALUES (:'requester_id', :'category_id', 'Pre-resolved ticket', 'Trying to start a ticket as resolved.', 'resolved');
ROLLBACK TO t4;

\echo
\echo '=== TEST 5: requester can create her own open ticket (expect 1 row, status open)'
SAVEPOINT t5;
SELECT set_config('request.jwt.claims', json_build_object('sub', :'requester_id'::text, 'role', 'authenticated')::text, true);
SET LOCAL ROLE authenticated;
INSERT INTO tickets (created_by, category_id, title, description)
  VALUES (:'requester_id', :'category_id', 'My new ticket', 'A normal ticket created by the requester.')
  RETURNING title, status;
ROLLBACK TO t5;

\echo
\echo '=== TEST 6: requester cannot change a ticket status (expect 0 rows)'
SAVEPOINT t6;
SELECT set_config('request.jwt.claims', json_build_object('sub', :'requester_id'::text, 'role', 'authenticated')::text, true);
SET LOCAL ROLE authenticated;
UPDATE tickets SET status = 'closed' WHERE id = '00000000-0000-0000-0000-00000000f002' RETURNING id;
ROLLBACK TO t6;

\echo
\echo '=== TEST 7: requester cannot promote herself (expect 0 rows or permission denied)'
SAVEPOINT t7;
SELECT set_config('request.jwt.claims', json_build_object('sub', :'requester_id'::text, 'role', 'authenticated')::text, true);
SET LOCAL ROLE authenticated;
UPDATE public.users SET user_role = 'admin' WHERE id = :'requester_id' RETURNING id;
ROLLBACK TO t7;

\echo
\echo '=== TEST 8: requester cannot comment on the admin ticket (expect row-level security error)'
SAVEPOINT t8;
SELECT set_config('request.jwt.claims', json_build_object('sub', :'requester_id'::text, 'role', 'authenticated')::text, true);
SET LOCAL ROLE authenticated;
INSERT INTO comments (ticket_id, author_id, body)
  VALUES ('00000000-0000-0000-0000-00000000f001', :'requester_id', 'Trying to comment on a ticket that is not mine.');
ROLLBACK TO t8;

\echo
\echo '=== TEST 9: requester can comment on her own ticket (expect 1 row)'
SAVEPOINT t9;
SELECT set_config('request.jwt.claims', json_build_object('sub', :'requester_id'::text, 'role', 'authenticated')::text, true);
SET LOCAL ROLE authenticated;
INSERT INTO comments (ticket_id, author_id, body)
  VALUES ('00000000-0000-0000-0000-00000000f002', :'requester_id', 'Thanks, I will try that.')
  RETURNING body;
ROLLBACK TO t9;

\echo
\echo '=== TEST 10: requester cannot delete tickets (expect 0 rows)'
SAVEPOINT t10;
SELECT set_config('request.jwt.claims', json_build_object('sub', :'requester_id'::text, 'role', 'authenticated')::text, true);
SET LOCAL ROLE authenticated;
DELETE FROM tickets WHERE id = '00000000-0000-0000-0000-00000000f002' RETURNING id;
ROLLBACK TO t10;

\echo
\echo '=== TEST 11: admin sees everything and can update (expect 2 tickets, 2 comments, UPDATE returns 1 row)'
SAVEPOINT t11;
SELECT set_config('request.jwt.claims', json_build_object('sub', :'admin_id'::text, 'role', 'authenticated')::text, true);
SET LOCAL ROLE authenticated;
SELECT count(*) AS tickets_seen_by_admin FROM tickets;
SELECT count(*) AS comments_seen_by_admin FROM comments;
UPDATE tickets SET status = 'in_progress' WHERE id = '00000000-0000-0000-0000-00000000f002' RETURNING id, status;
ROLLBACK TO t11;

ROLLBACK;