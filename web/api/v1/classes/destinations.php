<?php
namespace CaF;


// Declare libraries
use \PDO;
use Respect\Rest\Routable;

class Destinations implements Routable {


	//--------------------------------------------------------------------------------------------------------------------
	// PATCH: Update
	//--------------------------------------------------------------------------------------------------------------------
	public function patch($destinationGUID) {

		$logger = Common::getLogger();

		// Get user GUID
		$userGUID = getenv('USER_GUID');
		if (!$userGUID) {
			http_response_code(401);
			die();
		}

		// Verify passed ID
		if (!Common::isUUIDValid($destinationGUID)) {
			header('HTTP/ 404 Invalid ID: ' . $destinationGUID, true, 404);
			die();
		}

		// Read payload
		$payload = json_decode(file_get_contents('php://input'), true);
		if (!$payload) {
			header('HTTP/ 404 No data', true, 404);
			die();
		}

		// Get DB connection
		$db = Common::getDBConnection();

		// Load SQL statements
		$sqlStmts = Common::loadSqlStatements(__FILE__);

		// Prepare changes
		$changes = [];
		$setFavorite = false;
		foreach ($payload as $f => $value) {
			if ($f != 'destinationGUID' && $f != 'isFavorite') {
				// TODO: check for update permissions
				$changes[strtolower($f)] = $value;
			}
			if ($f == 'isFavorite') { $setFavorite = true; }
		}

		// Update destinations and fill table cache for current user
		if (count($changes) > 0) {

			// TODO: perform actual update

			// Set REST response code
			http_response_code(204);
		}
		$logger->debug("setFavorite: $setFavorite");
		$logger->debug("changes: " . print_r($changes, true));

		// Update favorites
		if ($setFavorite) {

			if ($payload['isFavorite']) {
				$stmt = $db
				->prepare($sqlStmts['0001']);
			} else {
				$stmt = $db
				->prepare($sqlStmts['0002']);
			}
			$stmt
			->bindParam(':tenantId', $_SERVER['TENANT_ID'], PDO::PARAM_INT)
			->bindParam(':objectGUID', $destinationGUID, PDO::PARAM_STR, 36)
			->bindParam(':userGUID', $userGUID, PDO::PARAM_STR)
			->execute();

			// Set REST response code
			http_response_code(204);

			// Submit job to update cache
			$logger->debug('Submitting job');
			$job = array(
				"token" => getenv('JWT_TOKEN'),
				"objectClass" => "tablesCache",
				"action" => "update",
				"tableName" => "destinations",
				"destinationGUID" => $destinationGUID
			);
			Common::getJQConnection()
			->useTube('backend')
			->put(json_encode($job));

		}

		//		// Update destinations cache
		//		$stmt = $db
		//		->prepare($sqlStmts['0003'])
		//		->bindParam(':userGUID', $userGUID, PDO::PARAM_STR)
		//		->bindParam(':destinationGUID', $destinationGUID, PDO::PARAM_STR, 36)
		//		->execute();

		// Cleanup
		Common::closeDbConnection($db);

	}


	//--------------------------------------------------------------------------------------------------------------------
	// PUT: Replace
	//--------------------------------------------------------------------------------------------------------------------
	public function put($destinationGUID) {

		// Get user GUID
		$userGUID = getenv('USER_GUID');
		if (!$userGUID) {
			http_response_code(401);
			die();
		}

		// Verify passed ID
		if (!Common::isUUIDValid($destinationGUID)) {
			header('HTTP/ 404 Invalid ID: ' . $destinationGUID, true, 404);
			die();
		}

		// Read payload
		$payload = json_decode(file_get_contents('php://input'), true);
		if (!$payload) {
			header('HTTP/ 404 No data', true, 404);
			die();
		}

		// Get DB connection
		$db = getDB();

		// Prepare changes
		$changes = [];
		foreach ($payload as $f => $value) {
			if ($f != 'destinationGUID') { $changes[strtolower($f)] = $value; }
		}
		$conditions['tenantid'] = $_SERVER['TENANT_ID'];
		$conditions['destinationguid'] = $destinationGUID;

		// Update destinations and fill table cache for current user
		$db->update('destinations', $changes, $conditions);
		$db->run($sqlStmts['0001']);

		// Set REST response code
		http_response_code(204);

		// Cleanup
		Common::closeDbConnection($db);

	}

}
