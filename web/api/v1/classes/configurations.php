<?php
namespace CaF;


// Declare libraries
use \PDO;

class Configurations implements \Respect\Rest\Routable {

	//--------------------------------------------------------------------------------------------------------------------
	// GET: Read
	//--------------------------------------------------------------------------------------------------------------------
	public function get($paramName = null) {

		// Get user GUID
		if (!$userGUID = getenv('USER_GUID')) {
			http_response_code(401);
			die();
		}

		// Get DB connection and load SQL statements
		$db = Common::getDBConnection();
		$sqlStmts = Common::loadSqlStatements(__FILE__);

		// Prepare SQL statement
		if ($paramName == null) {
			$stmt = $db
			->prepare($sqlStmts['0001']);
		} else {
			$stmt = $db
			->prepare($sqlStmts['0002'])
			->bindParam(':paramName', $paramName, PDO::PARAM_STR, 32);
		}

		// Bind common paramNames
		$stmt = $stmt
		->bindParam(':tenantId', $_SERVER['TENANT_ID'], PDO::PARAM_INT)
		->bindParam(':userGUID', $userGUID, PDO::PARAM_STR, 36);

		// Read data and write answer (or error)
		$configuration = $stmt->execute()->fetch(PDO::FETCH_ASSOC)['config'];

		// Cleanup
		Common::closeDbConnection($db);

		// Build answer
		if ($configuration) {
			header("Content-type: application/json");
			return $configuration;
		} else {
			http_response_code(404);
		}

	}

}


