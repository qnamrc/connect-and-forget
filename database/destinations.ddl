-- ----------------------------------------------------------------------------------------------------
-- TABLE: destinations
-- ----------------------------------------------------------------------------------------------------
DROP TABLE IF EXISTS destinations;
CREATE TABLE destinations (
  tenantId integer NOT NULL,
  destinationId serial NOT NULL,
  destinationGUID uuid NOT NULL DEFAULT gen_random_uuid(),
  name name NOT NULL,
  description character varying(255),
  comments text,
--  category character varying(32),
--  contacts jsonb,
  availability DESTINATION_AVAILABILITY DEFAULT 'Unavailable'::DESTINATION_AVAILABILITY,
  maintenanceNotice text,
  lastChanged timestamp without time zone DEFAULT now(),
  lastChangedBy uuid,
  CONSTRAINT destinations1 PRIMARY KEY (tenantId, destinationId),
  CONSTRAINT destinations2 UNIQUE (destinationGUID)
);
ALTER TABLE public.destinations
  OWNER TO postgres;
GRANT ALL ON TABLE public.destinations TO postgres;
GRANT SELECT, UPDATE, INSERT, TRUNCATE, DELETE ON TABLE public.destinations TO caf;
