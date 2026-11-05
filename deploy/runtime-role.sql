-- Run as the database owner after: npm run migrate --prefix server
-- Create cortexis_runtime separately using a strong secret via psql \password.
-- This file intentionally contains no password.
GRANT CONNECT ON DATABASE cortexis TO cortexis_runtime;
GRANT USAGE ON SCHEMA public TO cortexis_runtime;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO cortexis_runtime;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO cortexis_runtime;
ALTER DEFAULT PRIVILEGES FOR ROLE cortexis IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO cortexis_runtime;
ALTER DEFAULT PRIVILEGES FOR ROLE cortexis IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO cortexis_runtime;
