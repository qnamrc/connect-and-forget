-- ----------------------------------------------------------------------------------------------------
-- TABLE: connections
-- ----------------------------------------------------------------------------------------------------
DROP TABLE IF EXISTS connections;
CREATE TABLE public.connections (
  tenantId integer NOT NULL,
  connectionId serial NOT NULL,
  destinationId integer NOT NULL,
  connectionGUID uuid NOT NULL DEFAULT gen_random_uuid(),
  name name NOT NULL,
  description character varying(255),
  comments text,
  type connection_type,
	technologyId smallint NOT NULL,
  subnet cIdr,
	-- loginTypeId smallint,
  enableInstructions text,
  --loginCustomData text,
  --contacts jsonb,
  --capabilities bit(8),
	-- emailType smallint DEFAULT 0,
	-- emailRecipients text,
	-- enableEmailSubject CHARACTER VARYING(255),
	-- enableEmailBody text,
	-- disableEmailSubject CHARACTER VARYING(255),
	-- disableEmailBody text,
  --connectionCustomData text,
  configData jsonb,
  lastChanged timestamp without time zone,
  lastChangedby uuid,
  CONSTRAINT connections1 PRIMARY KEY (tenantId, connectionId),
  CONSTRAINT connections2 UNIQUE (connectionGUID)
);
ALTER TABLE public.connections
  OWNER TO postgres;
GRANT ALL ON TABLE public.connections TO postgres;
GRANT SELECT, UPDATE, INSERT, TRUNCATE, DELETE ON TABLE public.connections TO caf;
