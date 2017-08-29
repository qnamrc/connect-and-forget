CREATE TYPE CONNECTION_TYPE AS ENUM ('Single', 'Shared');
CREATE TYPE DESTINATION_AVAILABILITY AS ENUM ('Available', 'Unavailable', 'Maintenance');
CREATE TYPE IP_PORT AS (
	ipProtocol IP_PROTOCOL,
	portNumber INTEGER
);
CREATE TYPE IP_PROTOCOL AS ENUM ('tcp', 'udp');
CREATE TYPE LINK_PERMISSION AS ENUM ('Disabled', 'Queued', 'Enabling', 'Enabled', 'Disabling', 'Reconfiguring');
CREATE TYPE LINK_STATUS AS ENUM ('Terminated', 'Queued', 'Connecting', 'Established', 'Disconnecting', 'Failed', 'Recovering');

CREATE TYPE PROTOCOL AS (
  shortdescription character varying(10),
  description character varying(255),
  uri character varying(255),
  ports ipport[],
)
