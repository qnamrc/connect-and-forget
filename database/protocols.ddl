-- ----------------------------------------------------------------------------------------------------
-- TABLE: protocols
-- ----------------------------------------------------------------------------------------------------
DROP TABLE IF EXISTS protocols;
CREATE TABLE public.protocols (
  protocolid smallserial NOT NULL,
  protocolguid uuid NOT NULL DEFAULT gen_random_uuid(),
  shortdescription character varying(10),
  description character varying(255),
  uri character varying(255),
  useindynamicsystems boolean DEFAULT false,
  defaultports ip_port[],
  CONSTRAINT protocols1 PRIMARY KEY (protocolid),
  CONSTRAINT protocols2 UNIQUE (protocolguid)
);
ALTER TABLE public.protocols
  OWNER TO postgres;
GRANT ALL ON TABLE public.protocols TO postgres;
GRANT SELECT, UPDATE, INSERT, TRUNCATE, DELETE ON TABLE public.protocols TO caf;
