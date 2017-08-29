<?php
namespace CaF;


// Declare libraries
use \PDO;
use Respect\Rest\Routable;

class DestinationsCache implements Routable {

	//--------------------------------------------------------------------------------------------------------------------
	// GET: Read
	//--------------------------------------------------------------------------------------------------------------------
	public function get($destinationGUID = null, $childTableName = null) {

		// Get user GUID
		$userGUID = getenv('USER_GUID');
		if (!$userGUID) {
			http_response_code(401);
			die();
		}

		// Get DB connection
		$db = Common::getDBConnection();

		// Load SQL statements
		$sqlStmts = Common::loadSqlStatements(__FILE__);

		// Prepare SQL statement based on request
		if ($destinationGUID) {

			switch ($childTableName) {

				case 'connections':
				$stmt = $db
				->prepare($sqlStmts['0001']);
				$tableName = 'connections';
				break;

				case 'systems':
				$stmt = $db
				->prepare($sqlStmts['0001']);
				$tableName = 'systems';
				break;

				default:
				$stmt = $db
				->prepare($sqlStmts['0002']);
				$tableName = 'destinations';
				break;

			}

			// Bind common parameters
			$stmt = $stmt
			->bindParam(':tableName', $tableName, PDO::PARAM_STR)
			->bindParam(':destinationGUID', $destinationGUID, PDO::PARAM_STR, 36);

		} else {

			$stmt = $db
			->prepare($sqlStmts['0003']);

		}

		// Bind common parameters
		$stmt = $stmt
		->bindParam(':tenantId', $_SERVER['TENANT_ID'], PDO::PARAM_INT)
		->bindParam(':userGUID', $userGUID, PDO::PARAM_STR);

		// Read data and write answer (or error)
		$cacheData = $stmt->execute()->fetch(PDO::FETCH_ASSOC)['cachedata'];

		// Cleanup
		Common::closeDbConnection($db);

		// Build answer
		if ($cacheData) {
			header("Content-type: application/json");
			return $cacheData;
		} else {
			http_response_code(404);
		}

	}

}
