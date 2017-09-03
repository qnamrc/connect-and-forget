<?php
namespace CaF;

// Declare libraries
use \PDO;

// error_reporting(E_ALL);
class Links implements \Respect\Rest\Routable {


	//--------------------------------------------------------------------------------------------------------------------
	// POST: create link
	//--------------------------------------------------------------------------------------------------------------------
	public function post() {

		$logger = Common::getLogger();

		// Get user GUID
		if (!$userGUID = getenv('USER_GUID')) {
			http_response_code(401);
			die();
		}

		// Read payload
		$payload = json_decode(file_get_contents('php://input'), true);
		if (!$payload) {
			header('HTTP/ 404 No data', true, 404);
			die();
		}

		// Verify payload content
		if (!array_key_exists('connectionGUID', $payload)) {
			header('HTTP/ 404 Invalid data', true, 404);
			die();
		}

		// Read client IP address
		$ipAddress = Common::getClientIPAddress();
		if ($ipAddress == '') {
			header('HTTP/ 404 Invalid data', true, 404);
			die();
		}

		// Get DB connection and load SQL statements
		$db = Common::getDBConnection();
		$sqlStmts = Common::loadSqlStatements(__FILE__);

		// Read connection data
		$connectionData = new \Ayesh\CaseInsensitiveArray\Strict(
			$db
			->prepare($sqlStmts['0001'])
			->bindParam(':tenantId', $_SERVER['TENANT_ID'], PDO::PARAM_INT)
			->bindParam(':connectionGUID', $payload['connectionGUID'], PDO::PARAM_STR, 36)
			->bindParam(':userGUID', $userGUID, PDO::PARAM_STR, 36)
			->execute()->fetch(PDO::FETCH_ASSOC)
		);
		$logger->debug('Links.connectionData: ' . print_r($connectionData, true));

		// Insert or update link data
		switch ($connectionData['type']) {

			case 'Shared':
			$stmt = $db
			->prepare($sqlStmts['0002']);
			break;

			case 'Single':
			$stmt = $db
			->prepare($sqlStmts['0003']);
			break;

			default:
			$logger->error(get_class() . ': wrong connection type ' . $connectionData['type']);
			return false;
		}
		$linkData = new \Ayesh\CaseInsensitiveArray\Strict(
			$stmt
			->bindParam(':tenantId', $_SERVER['TENANT_ID'], PDO::PARAM_INT)
			->bindParam(':connectionId', $connectionData['connectionId'], PDO::PARAM_INT)
			->bindParam(':userGUID', $userGUID, PDO::PARAM_STR, 36)
			->bindParam(':ipAddress', $ipAddress, PDO::PARAM_STR, 46)
			->execute()->fetch(PDO::FETCH_ASSOC)
		);
		$logger->debug('Links.linkData: ' . print_r($linkData, true));

		// Set REST response code
		http_response_code(204);

		// Submit job to enable link
		$logger->debug('Links: Submitting job');
		$job = array(
			'tenantId' => $_SERVER['TENANT_ID'],
			'token' => getenv('JWT_TOKEN'),
			'action' => 'enable',
			'userGUID' => $userGUID,
			'linkGUID' => $linkData['linkGUID'],
			'ipAddress' => $ipAddress,
			'technology' => $connectionData['technology']
		);
		Common::getJQConnection()
		->useTube('connectors')
		->put(json_encode($job));

	}

}
