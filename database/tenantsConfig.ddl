-- ----------------------------------------------------------------------------------------------------
-- TABLE: tenantsConfig
-- ----------------------------------------------------------------------------------------------------
DROP TABLE IF EXISTS tenantsConfig;
CREATE TABLE public.tenantsConfig (
  tenantId serial NOT NULL,
	paramGUID uuid NOT NULL DEFAULT gen_random_uuid(),
	paramName varchar(64) NOT NULL,
  configuration jsonb,
	readRoleRequired AUTH_ROLE DEFAULT 'User'::AUTH_ROLE,
	writeRoleRequired AUTH_ROLE DEFAULT 'Administrator'::AUTH_ROLE,
  lastChanged timestamp without time zone DEFAULT now(),
  lastChangedBy uuid,
  CONSTRAINT tenantsConfig1 PRIMARY KEY (tenantId, paramName),
  CONSTRAINT tenantsConfig2 UNIQUE (paramGUID)
);
ALTER TABLE public.tenantsConfig
  OWNER TO postgres;
GRANT ALL ON TABLE public.tenantsConfig TO postgres;
GRANT SELECT, UPDATE, INSERT, TRUNCATE, DELETE ON TABLE public.tenantsConfig TO caf;
