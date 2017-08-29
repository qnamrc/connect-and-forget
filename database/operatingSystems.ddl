-- ----------------------------------------------------------------------------------------------------
-- TABLE: operatingSystems
-- ----------------------------------------------------------------------------------------------------
DROP TABLE IF EXISTS operatingSystems;
CREATE TABLE public.operatingsystems (
  osid smallserial NOT NULL,
  osguid uuid NOT NULL DEFAULT gen_random_uuid(),
  name text,
  icon text,
  defaultprotocols smallint[],
  CONSTRAINT operatingsystems1 PRIMARY KEY (osid),
  CONSTRAINT osguidoperatingsystems2 UNIQUE (osguid)
);
ALTER TABLE public.operatingsystems
  OWNER TO postgres;
GRANT ALL ON TABLE public.operatingsystems TO postgres;
GRANT SELECT, UPDATE, INSERT, TRUNCATE, DELETE ON TABLE public.operatingsystems TO caf;
