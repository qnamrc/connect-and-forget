-- ----------------------------------------------------------------------------------------------------
-- TABLE: groups
-- ----------------------------------------------------------------------------------------------------
DROP TABLE IF EXISTS groups;
CREATE TABLE public.groups (
  tenantid integer NOT NULL,
  groupid serial NOT NULL,
  groupguid uuid NOT NULL DEFAULT gen_random_uuid(),
  groupname character varying(255),
  description character varying(255),
  distinguishedname character varying(255),
  whenchanged timestamp(0) with time zone,
  CONSTRAINT groups1 PRIMARY KEY (tenantid, groupid),
  CONSTRAINT groups2 UNIQUE (groupguid)
);
ALTER TABLE public.groups
  OWNER TO postgres;
GRANT ALL ON TABLE public.groups TO postgres;
GRANT SELECT, UPDATE, INSERT, TRUNCATE, DELETE ON TABLE public.groups TO caf;
