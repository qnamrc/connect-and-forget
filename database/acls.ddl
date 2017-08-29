-- ----------------------------------------------------------------------------------------------------
-- TABLE: acls
-- ----------------------------------------------------------------------------------------------------
DROP TABLE IF EXISTS acls;
CREATE TABLE public.acls (
  tenantid integer NOT NULL,
  objectguid uuid NOT NULL,
  granteeguid uuid NOT NULL,
  accessmask bit(8),
  CONSTRAINT acls1 PRIMARY KEY (tenantid, objectguid, granteeguid)
);
ALTER TABLE public.acls
  OWNER TO postgres;
GRANT ALL ON TABLE public.acls TO postgres;
GRANT SELECT, UPDATE, INSERT, TRUNCATE, DELETE ON TABLE public.acls TO caf;

/*
access:
 - 0x00000001:
 - 0x00000002:
 - 0x00000004:
 - 0x00000008:
*/
