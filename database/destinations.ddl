-- ----------------------------------------------------------------------------------------------------
-- TABLE: destinations
-- ----------------------------------------------------------------------------------------------------
DROP TABLE IF EXISTS destinations;
CREATE TABLE destinations (
  tenantid integer NOT NULL,
  destinationid serial NOT NULL,
  destinationguid uuid NOT NULL DEFAULT gen_random_uuid(),
  name name NOT NULL,
  description character varying(255),
  comments text,
  category character varying(32),
  contacts jsonb,
  availability destination_availability DEFAULT 'Unavailable'::destination_availability,
  maintenancenotice text,
  lastchanged timestamp without time zone DEFAULT now(),
  lastchangeby character varying(128),
  lastchangedby uuid,
  CONSTRAINT destinations_pkey PRIMARY KEY (tenantid, destinationid),
  CONSTRAINT destinations_destinationguid_key UNIQUE (destinationguid)
);
ALTER TABLE public.destinations
  OWNER TO postgres;
GRANT ALL ON TABLE public.destinations TO postgres;
GRANT SELECT, UPDATE, INSERT, TRUNCATE, DELETE ON TABLE public.destinations TO caf;
