-- ----------------------------------------------------------------------------------------------------
-- TABLE: links
-- ----------------------------------------------------------------------------------------------------
DROP TABLE IF EXISTS links;
CREATE TABLE public.links (
  tenantid integer NOT NULL,
  linkguid uuid NOT NULL DEFAULT gen_random_uuid(),
  connectionid integer NOT NULL,
  lastchanged timestamp without time zone,
  ipaddresses cidr[],
  userguid uuid,
  permission link_permission,
  status link_status,
  CONSTRAINT links1 UNIQUE (tenantid, connectionid, userguid),
  CONSTRAINT links2 UNIQUE (linkguid)
);
ALTER TABLE public.links
  OWNER TO postgres;
GRANT ALL ON TABLE public.links TO postgres;
GRANT SELECT, UPDATE, INSERT, TRUNCATE, DELETE ON TABLE public.links TO caf;
