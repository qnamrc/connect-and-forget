-- ----------------------------------------------------------------------------------------------------
-- TABLE: favorites
-- ----------------------------------------------------------------------------------------------------
DROP TABLE IF EXISTS favorites;
CREATE TABLE public.favorites (
  tenantid integer NOT NULL,
  objectguid uuid NOT NULL,
  userguid uuid NOT NULL,
  CONSTRAINT favorites1 PRIMARY KEY (tenantid, objectguid, userguid)
);
ALTER TABLE public.favorites
  OWNER TO postgres;
GRANT ALL ON TABLE public.favorites TO postgres;
GRANT SELECT, UPDATE, INSERT, TRUNCATE, DELETE ON TABLE public.favorites TO caf;
