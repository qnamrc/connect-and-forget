-- ----------------------------------------------------------------------------------------------------
-- TABLE: connections
-- ----------------------------------------------------------------------------------------------------
DROP TABLE IF EXISTS connections;
CREATE TABLE public.connections (
  tenantid integer NOT NULL,
  connectionid serial NOT NULL,
  destinationid integer NOT NULL,
  connectionguid uuid NOT NULL DEFAULT gen_random_uuid(),
  name name NOT NULL,
  description character varying(255),
  comments text,
  type connection_type,
  subnet cidr,
	-- loginTypeId smallint,
  enableinstructions text,
  logincustomdata text,
  contacts jsonb,
  capabilities bit(8),
	-- emailType smallint DEFAULT 0,
	-- emailRecipients text,
	-- enableEmailSubject CHARACTER VARYING(255),
	-- enableEmailBody text,
	-- disableEmailSubject CHARACTER VARYING(255),
	-- disableEmailBody text,
  connectioncustomdata text,
  configdata jsonb,
  lastchanged timestamp without time zone,
  lastchangedby uuid,
  CONSTRAINT connections1 PRIMARY KEY (tenantid, connectionid),
  CONSTRAINT connections2 UNIQUE (connectionguid)
);
ALTER TABLE public.connections
  OWNER TO postgres;
GRANT ALL ON TABLE public.connections TO postgres;
GRANT SELECT, UPDATE, INSERT, TRUNCATE, DELETE ON TABLE public.connections TO caf;
