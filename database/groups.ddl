-- ----------------------------------------------------------------------------------------------------
-- TABLE: groups
-- ----------------------------------------------------------------------------------------------------
DROP TABLE IF EXISTS groups;
CREATE TABLE public.groups (
  tenantId integer NOT NULL,
  groupId serial NOT NULL,
  groupGUID uuid NOT NULL DEFAULT gen_random_uuid(),
  groupname character varying(255),
  description character varying(255),
  distinguishedName character varying(255),
  whenChanged timestamp(0) with time zone,
  CONSTRAINT groups1 PRIMARY KEY (tenantId, groupId),
  CONSTRAINT groups2 UNIQUE (groupGUID)
);
ALTER TABLE public.groups
  OWNER TO postgres;
GRANT ALL ON TABLE public.groups TO postgres;
GRANT SELECT, UPDATE, INSERT, TRUNCATE, DELETE ON TABLE public.groups TO caf;
