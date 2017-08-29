-- ----------------------------------------------------------------------------------------------------
-- TABLE: jsonCache
-- ----------------------------------------------------------------------------------------------------
DROP TABLE IF EXISTS jsonCache;
CREATE TABLE public.jsoncache (
  tenantid integer NOT NULL,
  userguid uuid NOT NULL,
  objectguid uuid NOT NULL,
  tablename name NOT NULL,
  lastchanged timestamp without time zone,
  cachedata jsonb,
  CONSTRAINT jsoncache_pkey PRIMARY KEY (tenantid, userguid, objectguid),
  CONSTRAINT jsoncache1 UNIQUE (tenantid, userguid, objectguid)
);
ALTER TABLE public.jsoncache
  OWNER TO postgres;
GRANT ALL ON TABLE public.jsoncache TO postgres;
GRANT SELECT, UPDATE, INSERT, TRUNCATE, DELETE ON TABLE public.jsoncache TO caf;
