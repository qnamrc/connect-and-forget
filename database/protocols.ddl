-- ----------------------------------------------------------------------------------------------------
-- TABLE: protocols
-- ----------------------------------------------------------------------------------------------------
DROP TABLE IF EXISTS protocols;
CREATE TABLE public.protocols (
  protocolId smallserial NOT NULL,
  protocolGUID uuid NOT NULL DEFAULT gen_random_uuid(),
  shortDescription character varying(10),
  description character varying(255),
  uri character varying(255),
  useInDynamicSystems boolean DEFAULT false,
  defaultPorts IP_PORT[],
  CONSTRAINT protocols1 PRIMARY KEY (protocolId),
  CONSTRAINT protocols2 UNIQUE (protocolGUID)
);
ALTER TABLE public.protocols
  OWNER TO postgres;
GRANT ALL ON TABLE public.protocols TO postgres;
GRANT SELECT, UPDATE, INSERT, TRUNCATE, DELETE ON TABLE public.protocols TO caf;
