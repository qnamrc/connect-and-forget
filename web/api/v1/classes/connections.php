<?php
namespace CaF;


// Declare libraries
use \PDO;

class Connections implements \Respect\Rest\Routable {


	//--------------------------------------------------------------------------------------------------------------------
	// GET: Read
	//--------------------------------------------------------------------------------------------------------------------
	public function get($connectionGUID = null) {

		// Get user id
		if (!$userGUID = getenv('USER_GUID')) {
			http_response_code(401);
			die();
		}

		// Verify passed ID
		if ($connectionGUID != null && !Common::isUUIDValid($connectionGUID)) {
			header('HTTP/ 404 Invalid ID: ' . $connectionGUID, true, 404);
			die();
		}

		// Get DB connection and load SQL statements
		$db = Common::getDBConnection();
		$sqlStmts = Common::loadSqlStatements(__FILE__);

		// Prepare SQL statement
		if ($connectionGUID == null) {

			if (array_key_exists('destinationGUID', $_REQUEST)) {
				$stmt = $db
				->prepare($sqlStmts['0001'].$sqlStmts['0001.a'])
				->bindParam(':destinationGUID', $_REQUEST['destinationGUID'], PDO::PARAM_STR, 36);
			}
			else {
				$stmt = $db
				->prepare($sqlStmts['0001']);
			}
		} else {
			$stmt = $db
			->prepare($sqlStmts['0001'].$sqlStmts['0001.b'])
			->bindParam(':connectionGUID', $connectionGUID, PDO::PARAM_STR, 36);
		}

		// Read data and write answer (or error)
		$connections = new \Ayesh\CaseInsensitiveArray\Strict(
			$stmt
			->bindParam(':tenantId', $_SERVER['TENANT_ID'], PDO::PARAM_INT)
			->bindParam(':userGUID', $userGUID, PDO::PARAM_STR, 36)
			->execute()->fetch(PDO::FETCH_ASSOC)
		);

		// Cleanup
		Common::closeDbConnection($db);

		// Build answer
		if (array_key_exists('connections', $connections)) {
			header("Content-type: application/json");
			return $connections['connections'];
		} else {
			http_response_code(404);
		}

	}

}
