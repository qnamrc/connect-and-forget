<?php

$_SERVER['TENANT_ID'] = 0;
$_SERVER['TENANT_GUID'] = 'bf6286ef-4864-4394-8bd1-ab34a8b0c964';

$_SERVER['DB_HOST'] = 'localhost';
$_SERVER['DB_PORT'] = 5432;
$_SERVER['DB_NAME'] = 'dev';
$_SERVER['DB_USERNAME'] = 'dev';
$_SERVER['DB_PASSWORD'] = 'A1d3baran';

$_SERVER['JQ_HOST'] = 'localhost';
$_SERVER['JQ_PORT'] = 11300 + $_SERVER['TENANT_ID'];

$_SERVER['MQ_HOST'] = 'localhost';
$_SERVER['MQ_PORT'] = 1883;
$_SERVER['MQ_USERNAME'] = '505c8d6c-415f-4e25-a097-c285748ff4f8';
$_SERVER['MQ_PASSWORD'] = 'asdsfghjkl';
$_SERVER['MQ_PREFIX'] = 'bf6286ef-4864-4394-8bd1-ab34a8b0c964/';

$_SERVER['JWT_SECRET'] = 'pqapwp9aIeOYV9g1qYvmxauEuPQJwnvl';
