-- ----------------------------------------------------------------------------------------------------
-- TABLE: favorites
-- ----------------------------------------------------------------------------------------------------
DROP TABLE IF EXISTS favorites;
CREATE TABLE public.favorites (
  tenantId integer NOT NULL,
  objectGUID uuid NOT NULL,
  userGUID uuid NOT NULL,
  CONSTRAINT favorites1 PRIMARY KEY (tenantId, objectGUID, userGUID)
);
ALTER TABLE public.favorites
  OWNER TO postgres;
GRANT ALL ON TABLE public.favorites TO postgres;
GRANT SELECT, UPDATE, INSERT, TRUNCATE, DELETE ON TABLE public.favorites TO caf;
