-- ----------------------------------------------------------------------------------------------------
-- TABLE: links
-- ----------------------------------------------------------------------------------------------------
DROP TABLE IF EXISTS links;
CREATE TABLE public.links (
  tenantId integer NOT NULL,
  linkGUID uuid NOT NULL DEFAULT gen_random_uuid(),
  connectionId integer NOT NULL,
  ipaddresses cIdr[],
  userGUID uuid,
  permission link_permission,
  status link_status,
  lastChanged timestamp without time zone DEFAULT now(),
  lastChangedBy uuid,
  CONSTRAINT links1 PRIMARY KEY (tenantId, connectionId, userGUID),
  CONSTRAINT links2 UNIQUE (linkGUID)
);
ALTER TABLE public.links
  OWNER TO postgres;
GRANT ALL ON TABLE public.links TO postgres;
GRANT SELECT, UPDATE, INSERT, TRUNCATE, DELETE ON TABLE public.links TO caf;
