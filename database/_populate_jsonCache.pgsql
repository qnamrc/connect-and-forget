-- ----------------------------------------------------------------------------------------------------
-- jsonCache: destinations
-- ^.*?\s(.*?)\s.*
-- '$1', $1,
-- ----------------------------------------------------------------------------------------------------
INSERT INTO jsoncache(
	tenantId,
	userGUID,
	objectGUID,
	tableName,
	lastChanged,
	cacheData
)
SELECT
	d.tenantId,
	a.granteeGUID,
	d.destinationGUID,
	'destinations',
	current_timestamp,
	json_build_object(
		'destinationGUID', d.destinationGUID,
		'name', d.name,
		'description', d.description,
		'comments', d.comments,
		'category', d.category,
		'contacts', d.contacts,
		'availability', d.availability,
		'maintenanceNotice', d.maintenanceNotice,
		'isFavorite', CASE WHEN f.userGUID IS NULL THEN 'false' ELSE 'true' END
	)
FROM
	destinations d
	JOIN acls a ON d.tenantId = a.tenantId AND d.destinationGUID = a.objectGUID
	LEFT JOIN favorites f ON d.tenantId = a.tenantId AND d.destinationGUID = f.objectGUID AND a.granteeGUID = f.userGUID
WHERE
	a.accessMask = B'00000001'
ON CONFLICT (
  tenantId,
	userGUID,
	objectGUID
) DO UPDATE SET
    lastChanged = current_timestamp,
    cacheData = EXCLUDED.cacheData
;
--SELECT * FROM jsonCache WHERE tableName = 'destinations';


-- ----------------------------------------------------------------------------------------------------
-- jsonCache: destinationsList
-- ----------------------------------------------------------------------------------------------------
INSERT INTO jsoncache(
	tenantId,
	userGUID,
	objectGUID,
	tableName,
	lastChanged,
	cacheData
)
SELECT
	d.tenantId,
	a.granteeGUID,
	'00000000-0000-4000-8000-000000000000',
	'destinationsList',
	current_timestamp,
	json_agg(json_build_object(
		'destinationGUID', d.destinationGUID,
		'name', d.name,
		'description', d.description,
		'isFavorite', CASE WHEN f.userGUID IS NULL THEN 'false' ELSE 'true' END
	))
FROM
	destinations d
	JOIN acls a ON d.destinationGUID = a.objectGUID
	LEFT JOIN favorites f ON d.tenantId = a.tenantId AND d.destinationGUID = f.objectGUID AND a.granteeGUID = f.userGUID
WHERE
	a.accessMask = B'00000001'
GROUP BY
	d.tenantId,
	a.granteeGUID
ON CONFLICT (
  tenantId,
	userGUID,
	objectGUID
) DO UPDATE SET
    lastChanged = current_timestamp,
    cacheData = EXCLUDED.cacheData
;
--SELECT * FROM jsonCache WHERE tableName = 'destinationsList';


-- ----------------------------------------------------------------------------------------------------
-- jsonCache: connections
-- ----------------------------------------------------------------------------------------------------
INSERT INTO jsoncache(
	tenantId,
	userGUID,
	objectGUID,
	tableName,
	lastChanged,
	cacheData
)
SELECT
	d.tenantId,
	a.granteeGUID,
	c.connectionGUID,
	'connections',
	current_timestamp,
	json_build_object(
		'destinationGUID', d.destinationGUID,
		'connectionGUID', c.connectionGUID,
		'name', c.name,
		'description', c.description,
		'comments', c.comments,
		'type', c.type,
		'subnet', c.subnet,
		'enableInstructions', c.enableInstructions,
		'loginCustomData', c.loginCustomData,
		'contacts', c.contacts,
		'capabilities', c.capabilities,
		'connectionCustomData', c.connectionCustomData,
		'configData', c.configData
	)
FROM
	connections c
	JOIN acls a ON c.connectionGUID = a.objectGUID
	JOIN destinations d ON c.tenantId = d.tenantId AND c.destinationId = d.destinationId
WHERE
	a.accessMask = B'00000001'
ON CONFLICT (
    tenantId,
	userGUID,
	objectGUID
) DO UPDATE SET
	lastChanged = EXCLUDED.lastChanged,
	cacheData = EXCLUDED.cacheData
;
--SELECT * FROM jsonCache WHERE tableName = 'connections';

-- ----------------------------------------------------------------------------------------------------
-- jsonCache: systems
-- ----------------------------------------------------------------------------------------------------
INSERT INTO jsoncache(
	tenantId,
	userGUID,
	objectGUID,
	tableName,
	lastChanged,
	cacheData
)
SELECT
	s.tenantId,
	a.granteeGUID,
	s.systemGUID,
	'systems',
	current_timestamp,
	json_build_object(
		'systemGUID', s.systemGUID,
		'destinationGUID', d.destinationGUID,
		'connectionGUID', c.connectionGUID,
		'name', s.name,
		'description', s.description,
		'comments', s.comments,
		'ipAddress', host(s.ipAddress),
		'customerIpAddress', host(s.customerIpAddress),
		'deviceIpAddress', host(s.deviceIpAddress),
-- os???
-- protocols?: IProtocol[];
		'updateDns', s.updateDns,
		'lastFoundUp', s.lastFoundUp,
		'fqdn', s.name || '.domain.local'
	)
FROM
	systems s
	JOIN acls a ON s.systemGUID = a.objectGUID
	JOIN connections c ON s.tenantId = c.tenantId AND s.connectionId = c.connectionId
	JOIN destinations d ON c.tenantId = d.tenantId AND c.destinationId = d.destinationId
WHERE
	a.accessMask = B'00000001'
ON CONFLICT (
    tenantId,
    userGUID,
    objectGUID
) DO UPDATE SET
    lastChanged = current_timestamp,
    cacheData = EXCLUDED.cacheData
;
--SELECT * FROM jsonCache WHERE tableName = 'systems';
