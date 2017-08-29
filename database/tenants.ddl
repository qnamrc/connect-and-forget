-- ----------------------------------------------------------------------------------------------------
-- TABLE: tenants
-- ----------------------------------------------------------------------------------------------------
DROP TABLE IF EXISTS tenants;
CREATE TABLE public.tenants (
  tenantid serial NOT NULL,
  tenantguid uuid NOT NULL DEFAULT gen_random_uuid(),
  lastchanged timestamp without time zone DEFAULT now(),
  lastchangedby uuid,
  configuration jsonb,
  privateconfiguration jsonb,
  CONSTRAINT tenants_pkey PRIMARY KEY (tenantid)
);
ALTER TABLE public.tenants
  OWNER TO postgres;
GRANT ALL ON TABLE public.tenants TO postgres;
GRANT SELECT, UPDATE, INSERT, TRUNCATE, DELETE ON TABLE public.tenants TO caf;
