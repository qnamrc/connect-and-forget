<?php
namespace CaF;


// Declare libraries
use \PDO;
use Respect\Rest\Routable;

class Connections implements Routable {


	//--------------------------------------------------------------------------------------------------------------------
	// GET: Read
	//--------------------------------------------------------------------------------------------------------------------
	public function get($connectionGUID = null) {

		// Get user id
		$userGUID = getenv('USER_GUID');
		if (!$userGUID) {
			http_response_code(401);
			die();
		}

		// Verify passed ID
		if ($connectionGUID != null && !Common::isUUIDValid($connectionGUID)) {
			header('HTTP/ 404 Invalid ID: ' . $connectionGUID, true, 404);
			die();
		}

		// Get DB connection
		$db = Common::getDBConnection();

		// Load SQL statements
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

		// Bind common parameters
		$stmt = $stmt
		->bindParam(':tenantId', $_SERVER['TENANT_ID'], PDO::PARAM_INT)
		->bindParam(':userGUID', $userGUID, PDO::PARAM_STR, 36)
		;

		// Read data and write answer (or error)
		$connections = $stmt->execute()->fetch(PDO::FETCH_ASSOC);

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
