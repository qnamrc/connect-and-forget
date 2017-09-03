-- ----------------------------------------------------------------------------------------------------
-- TABLE: operatingSystems
-- ----------------------------------------------------------------------------------------------------
DROP TABLE IF EXISTS operatingSystems;
CREATE TABLE public.operatingSystems (
  osId smallserial NOT NULL,
  osGUID uuid NOT NULL DEFAULT gen_random_uuid(),
  name text,
  icon text,
  defaultProtocols smallint[],
  CONSTRAINT operatingSystems1 PRIMARY KEY (osId),
  CONSTRAINT operatingSystems2 UNIQUE (osGUID)
);
ALTER TABLE public.operatingSystems
  OWNER TO postgres;
GRANT ALL ON TABLE public.operatingSystems TO postgres;
GRANT SELECT, UPDATE, INSERT, TRUNCATE, DELETE ON TABLE public.operatingSystems TO caf;
