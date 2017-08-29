-- ----------------------------------------------------------------------------------------------------
-- TABLE: groupsMembers
-- ----------------------------------------------------------------------------------------------------
DROP TABLE IF EXISTS groupsmembers;
CREATE TABLE public.groupsmembers (
  tenantid integer NOT NULL,
  groupid integer NOT NULL,
  memberid integer NOT NULL,
  CONSTRAINT groupsmembers1 PRIMARY KEY (tenantid, groupid, memberid)
);
ALTER TABLE public.groupsmembers
  OWNER TO postgres;
GRANT ALL ON TABLE public.groupsmembers TO postgres;
GRANT SELECT, UPDATE, INSERT, TRUNCATE, DELETE ON TABLE public.groupsmembers TO caf;
