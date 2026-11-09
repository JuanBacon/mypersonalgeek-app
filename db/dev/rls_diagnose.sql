\echo '=== Policies per table (expect 10 rows in total)'
SELECT tablename, policyname, cmd, roles
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, cmd, policyname;

\echo
\echo '=== Is RLS enabled on each table? (expect rls_enabled = t for all)'
SELECT relname AS table_name, relrowsecurity AS rls_enabled
FROM pg_class
WHERE relnamespace = 'public'::regnamespace AND relkind = 'r'
ORDER BY relname;

\echo
\echo '=== Do the helper functions exist? (expect is_admin and handle_new_user)'
SELECT proname
FROM pg_proc
WHERE pronamespace = 'public'::regnamespace
  AND proname IN ('is_admin', 'handle_new_user', 'set_updated_at')
ORDER BY proname;

\echo
\echo '=== Users and roles (expect one admin and one requester)'
SELECT display_name, user_role FROM public.users ORDER BY created_at;