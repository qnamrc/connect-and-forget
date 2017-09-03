<?php
namespace CaF;


// Declare libraries
use \PDO;

class SystemsCache implements \Respect\Rest\Routable {

	//--------------------------------------------------------------------------------------------------------------------
	// GET: Read
	//--------------------------------------------------------------------------------------------------------------------
	public function get($systemId = null) {

		// Get user GUID
		if (!$userGUID = getenv('USER_GUID')) {
			http_response_code(401);
			die();
		}

		// Get DB connection and load SQL statements
		$db = Common::getDBConnection();
		$sqlStmts = Common::loadSqlStatements(__FILE__);

		// Prepare SQL statement
		if ($systemId == null) {
			$stmt = $db
			->prepare($sqlStmts['0001']);
		} else {
			$stmt = $db
			->prepare($sqlStmts['0002'])
			->bindParam(':objectGUID', $systemId, PDO::PARAM_STR, 32);
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
