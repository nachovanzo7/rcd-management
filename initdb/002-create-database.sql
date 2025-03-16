DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'gestion_rcd_database') THEN
        CREATE DATABASE gestion_rcd_database
        WITH OWNER = rcd_username
        ENCODING = 'UTF8'
        LC_COLLATE = 'C'
        LC_CTYPE = 'C'
        TEMPLATE = template0;
    END IF;
END
$$;
