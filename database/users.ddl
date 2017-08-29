-- ----------------------------------------------------------------------------------------------------
-- TABLE: users
-- ----------------------------------------------------------------------------------------------------
DROP TABLE IF EXISTS users;
CREATE TABLE public.users (
  tenantid integer NOT NULL,
  userid serial NOT NULL,
  userguid uuid NOT NULL DEFAULT gen_random_uuid(),
  cn character varying(255),
  description character varying(255),
  displayname character varying(255),
  distinguishedname character varying(255),
  givenname character varying(255),
  mail character varying(255),
  name character varying(255),
  realm character varying(128),
  sn character varying(255),
  office character varying(255),
  telephone character varying(255),
  mobile character varying(255),
  extension character varying(255),
  CONSTRAINT users1 PRIMARY KEY (tenantid, userid),
  CONSTRAINT users2 UNIQUE (userguid)
);
ALTER TABLE public.users
  OWNER TO postgres;
GRANT ALL ON TABLE public.users TO postgres;
GRANT SELECT, UPDATE, INSERT, TRUNCATE, DELETE ON TABLE public.users TO caf;
