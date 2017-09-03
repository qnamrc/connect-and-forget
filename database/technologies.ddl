-- ----------------------------------------------------------------------------------------------------
-- TABLE: technologies
-- ----------------------------------------------------------------------------------------------------
DROP TABLE IF EXISTS technologies;
CREATE TABLE public.technologies (
  technolgyId smallserial NOT NULL,
  technolgyGUID uuid NOT NULL DEFAULT gen_random_uuid(),
  shortdescription character varying(10),
  description character varying(255),
  CONSTRAINT technolgies1 PRIMARY KEY (technolgyId),
  CONSTRAINT technolgies2 UNIQUE (technolgyGUID)
);
ALTER TABLE public.technologies
  OWNER TO postgres;
GRANT ALL ON TABLE public.technologies TO postgres;
GRANT SELECT, UPDATE, INSERT, TRUNCATE, DELETE ON TABLE public.technologies TO caf;
