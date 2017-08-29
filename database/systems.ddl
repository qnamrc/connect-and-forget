-- ----------------------------------------------------------------------------------------------------
-- TABLE: systems
-- ----------------------------------------------------------------------------------------------------
DROP TABLE IF EXISTS systems;
CREATE TABLE public.systems (
  tenantid integer NOT NULL,
  systemid serial NOT NULL,
  connectionid integer NOT NULL,
  sequence smallint,
  osid smallint,
--	protocols PROTOCOLS[],
  systemguid uuid NOT NULL DEFAULT gen_random_uuid(),
  name name NOT NULL,
  description character varying(255),
  comments text,
  ipaddress inet NOT NULL,
  customeripaddress inet NOT NULL,
  deviceipaddress inet,
  updatedns boolean DEFAULT false,
  lastfoundup timestamp without time zone,
  lastchanged timestamp without time zone DEFAULT now(),
  protocols protocols[],
  lastchangedby uuid,
  CONSTRAINT systems1 PRIMARY KEY (tenantid, connectionid, systemid),
  CONSTRAINT systems2 UNIQUE (systemguid)
);
ALTER TABLE public.systems
  OWNER TO postgres;
GRANT ALL ON TABLE public.systems TO postgres;
GRANT SELECT, UPDATE, INSERT, TRUNCATE, DELETE ON TABLE public.systems TO caf;
