#!/usr/bin/php
<?php

// Includes
require_once(__DIR__ . '/../vendor/autoload.php');

// Declare libraries
// use Pheanstalk\Pheanstalk;

// Service classes
use CaF\Auth;
use CaF\Common;


// Objects classes
use CaF\TablesCache;


//########################################################################################################################
// MAIN
//########################################################################################################################

// Load tenant-specific configuration
if ($argc < 2) { die("Missing tenant id\n"); }
$tenantId = $argv[1];
require_once(__DIR__ . '/t' . $tenantId . '.config.inc');

// Store root path into a variable
putenv('ROOT_DIR=' . dirname(__FILE__));

$logger = Common::getLogger();

do {

	try {

		// Setup connection with queue manager
		$jq = Common::getJQConnection();

		// Watch for message in backend queue (and ignore default one))
		// $jq->watch('default');
		$jq->watch('backend');
		$jq->ignore('default');

	} catch (Exception $error) {
		$logger->critical($error->getMessage());
		break;
	}
	$logger->debug('OK, listening for requests');

	// Process queued requests
	do {

		// Wait for jobs
		$request = $jq->reserve();
		$logger->debug('Request: ' . print_r($request, true));

		// Read job data
		$requestData['id'] = $request->getId();
		$requestData = json_decode($request->getData(), true);
		$logger->debug('Request data: ' . print_r($requestData, true));

		// Verify request authorization
		try {
			if (!Auth::isRequestAuthorized($requestData)) {
				continue;
			};
		} catch (Exception $error) {
			$logger->error('Request has malformed auth data');
			continue;
		}
		$logger->debug('OK, request is authorized');

		// Verify job has all the data we need
		foreach (['objectClass'] as $key) {
			if (!array_key_exists($key, $requestData)) {
				$logger->error("Request misses $key field");
				$jq->bury($request);	// TODO: bury->delete
				continue;
			}
		}

		// Process requests
		switch ($requestData['objectClass']) {

			case 'tablesCache':
			$return = TablesCache::manage($requestData);
			break;

			default:
			$return = false;
			break;

		}

		if ($return) {
			$jq->bury($request);			// TODO: DEBUG
			// $jq->delete($request);
		} else {
			$jq->bury($request);
		}

	} while(true);

	// Wait some time before retrying
	sleep(5);

} while(true);
