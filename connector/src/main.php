#!/usr/bin/php
<?php

// Includes
require_once(__DIR__ . '/../vendor/autoload.php');

// Declare libraries
use Pheanstalk\Pheanstalk;

// Service classes
use CaF\Auth;
use CaF\Common;


// Link classes
use CaF\CCVPN;
use CaF\CCSSL;


//########################################################################################################################
// MAIN
//########################################################################################################################

// Load tenant-specific configuration
if ($argc < 2) { die("Missing tenant id\n"); }
$tenantId = $argv[1];
require_once(__DIR__ . '/t' . $tenantId . '.config.inc');
echo "Started\n";	// TODO: remove

// Store root path into a variable
putenv('ROOT_DIR=' . dirname(__FILE__));

$logger = Common::getLogger();

do {

	try {

		// Setup connection with queue manager, watch for message in connector queue (and ignore default one))
		$jq = Common::getJQConnection()
		->watch('connectors')
		->ignore('default');

	} catch (Exception $error) {
		$logger->critical($error->getMessage());
		die($error->getMessage());
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
			if (!Auth::isRequestAuthorized($requestData)) { continue; };
		} catch (Exception $error) {
			$logger->error('Request has malformed auth data');
			continue;
		}
		$logger->debug('OK, request is authorized');

		// Verify job has all the data we need
		foreach (['action', 'userGUID', 'linkGUID', 'ipAddress'] as $key) {
			if (!array_key_exists($key, $requestData)) {
				$logger->error("Request misses $key field");
				$jq->delete($request);
				continue;
			}
		}

		// Process requests
		switch ($requestData['technology']) {

			case 'CCVPN': $return = CCVPN::manage($requestData); break;
			case 'CCSSL': $return = CCSSL::manage($requestData); break;

			default:
			$logger->error('Unknown technology: ' . $requestData['technology']);
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
