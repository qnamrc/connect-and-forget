-- ----------------------------------------------------------------------------------------------------
-- TABLE: acls
-- ----------------------------------------------------------------------------------------------------
DROP TABLE IF EXISTS acls;
CREATE TABLE public.acls (
  tenantId integer NOT NULL,
  objectGUID uuid NOT NULL,
  granteeGUID uuid NOT NULL,
  accessMask bit(8),
  CONSTRAINT acls1 PRIMARY KEY (tenantId, objectGUID, granteeGUID)
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
