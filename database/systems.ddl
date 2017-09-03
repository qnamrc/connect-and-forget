-- ----------------------------------------------------------------------------------------------------
-- TABLE: systems
-- ----------------------------------------------------------------------------------------------------
DROP TABLE IF EXISTS systems;
CREATE TABLE public.systems (
  tenantId integer NOT NULL,
  systemId serial NOT NULL,
  connectionId integer NOT NULL,
  sequence smallint,
  osId smallint,
--	protocols PROTOCOLS[],
  systemGUID uuid NOT NULL DEFAULT gen_random_uuid(),
  name name NOT NULL,
  description character varying(255),
  comments text,
  ipAddress inet NOT NULL,
  customerIpAddress inet NOT NULL,
  deviceIpAddress inet,
  updateDns boolean DEFAULT false,
  lastFoundUp timestamp without time zone,
  protocols protocols[],
  lastChanged timestamp without time zone DEFAULT now(),
  lastChangedBy uuid,
  CONSTRAINT systems1 PRIMARY KEY (tenantId, connectionId, systemId),
  CONSTRAINT systems2 UNIQUE (systemGUID)
);
ALTER TABLE public.systems
  OWNER TO postgres;
GRANT ALL ON TABLE public.systems TO postgres;
GRANT SELECT, UPDATE, INSERT, TRUNCATE, DELETE ON TABLE public.systems TO caf;
