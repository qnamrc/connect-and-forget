-- ----------------------------------------------------------------------------------------------------
-- TABLE: jsonCache
-- ----------------------------------------------------------------------------------------------------
DROP TABLE IF EXISTS jsonCache;
CREATE TABLE public.jsonCache (
  tenantId integer NOT NULL,
  userGUID uuid NOT NULL,
  objectGUID uuid NOT NULL,
  tableName name NOT NULL,
  lastChanged timestamp without time zone,
  cacheData jsonb,
  CONSTRAINT jsonCache1 PRIMARY KEY (tenantId, userGUID, objectGUID),
  CONSTRAINT jsonCache2 UNIQUE (tenantId, userGUID, objectGUID)
);
ALTER TABLE public.jsonCache
  OWNER TO postgres;
GRANT ALL ON TABLE public.jsonCache TO postgres;
GRANT SELECT, UPDATE, INSERT, TRUNCATE, DELETE ON TABLE public.jsonCache TO caf;
