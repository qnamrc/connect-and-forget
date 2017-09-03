-- ----------------------------------------------------------------------------------------------------
-- TABLE: users
-- ----------------------------------------------------------------------------------------------------
DROP TABLE IF EXISTS users;
CREATE TABLE public.users (
  tenantId integer NOT NULL,
  userId serial NOT NULL,
  userGUID uuid NOT NULL DEFAULT gen_random_uuid(),
  cn character varying(255),
  description character varying(255),
  displayName character varying(255),
  distinguishedName character varying(255),
  givenName character varying(255),
  mail character varying(255),
  name character varying(255),
  realm character varying(128),
  sn character varying(255),
  office character varying(255),
  telephone character varying(255),
  mobile character varying(255),
  extension character varying(255),
	role AUTH_ROLE NOT NULL DEFAULT 'User'::AUTH_ROLE,
  CONSTRAINT users1 PRIMARY KEY (tenantId, userId),
  CONSTRAINT users2 UNIQUE (userGUID)
);
ALTER TABLE public.users
  OWNER TO postgres;
GRANT ALL ON TABLE public.users TO postgres;
GRANT SELECT, UPDATE, INSERT, TRUNCATE, DELETE ON TABLE public.users TO caf;

ALTER TABLE public.users
   ADD COLUMN role AUTH_ROLE NOT NULL DEFAULT 'User'::AUTH_ROLE;
