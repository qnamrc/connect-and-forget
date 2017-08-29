#!/usr/bin/php
<?php

// Includes
require_once(__DIR__ . '/../vendor/autoload.php');
require_once(__DIR__ . '/config.inc');

// Declare libraries
use Pheanstalk\Pheanstalk;

// Service classes
use CaF\Auth;
use CaF\Common;


// Objects classes
use CaF\Links;


//########################################################################################################################
// MAIN
//########################################################################################################################

// Store root path into a variable
putenv('ROOT_DIR=' . dirname(__FILE__));

$logger = Common::getLogger();

try {

	// Setup connection with queue manager
	$jq = new Pheanstalk($_SERVER['JQ_HOST'] . ($_SERVER['JQ_PORT'] == '' ? '' : ':' . $_SERVER['JQ_PORT']));

	// Watch for message in backend queue (and ignore default one))
	$jq->watch('default');
	// $jq->watch('backend');
	// $jq->ignore('default');

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
		if (!Auth::isRequestAuthorized($requestData)) {
			continue;
		};
	} catch (Exception $error) {
		$logger->error('Request has malformed auth data');
		continue;
	}
	$logger->debug('OK, request is authorized');

	// Verify job has all the data we need
	foreach (['objectGUID', 'object'] as $key) {
		if (!array_key_exists($key, $requestData)) {
			$logger->error("Request misses $key field");
			$jq->bury($request);	// TODO: bury->delete
			continue;
		}
	}

	// Process requests
	switch ($requestData['objectClass']) {

		case 'link':
		Links::manage($requestData);
		break;

		default:
		# code...
		break;

	}

	$jq->delete($request);

} while(true);
