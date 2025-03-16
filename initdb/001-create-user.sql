DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_user WHERE usename = 'rcd_username') THEN
        CREATE USER rcd_username WITH PASSWORD 'rcd_gestion';
    END IF;
END
$$;
