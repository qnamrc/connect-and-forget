-- ----------------------------------------------------------------------------------------------------
-- TABLE: groupsMembers
-- ----------------------------------------------------------------------------------------------------
DROP TABLE IF EXISTS groupsMembers;
CREATE TABLE public.groupsMembers (
  tenantId integer NOT NULL,
  groupId integer NOT NULL,
  memberId integer NOT NULL,
  CONSTRAINT groupsMembers1 PRIMARY KEY (tenantId, groupId, memberId)
);
ALTER TABLE public.groupsMembers
  OWNER TO postgres;
GRANT ALL ON TABLE public.groupsMembers TO postgres;
GRANT SELECT, UPDATE, INSERT, TRUNCATE, DELETE ON TABLE public.groupsMembers TO caf;
