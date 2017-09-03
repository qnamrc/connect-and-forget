-- ----------------------------------------------------------------------------------------------------
-- TABLE: tenants
-- ----------------------------------------------------------------------------------------------------
DROP TABLE IF EXISTS tenants;
CREATE TABLE public.tenants (
  tenantId serial NOT NULL,
  tenantGUID uuid NOT NULL DEFAULT gen_random_uuid(),
  lastChanged timestamp without time zone DEFAULT now(),
  lastChangedBy uuid,
  CONSTRAINT tenants_pkey PRIMARY KEY (tenantId)
);
ALTER TABLE public.tenants
  OWNER TO postgres;
GRANT ALL ON TABLE public.tenants TO postgres;
GRANT SELECT, UPDATE, INSERT, TRUNCATE, DELETE ON TABLE public.tenants TO caf;
