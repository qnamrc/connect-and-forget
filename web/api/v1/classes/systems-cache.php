<?php
namespace CaF;


// Declare libraries
use \PDO;
use Respect\Rest\Routable;

class SystemsCache implements Routable {

	//--------------------------------------------------------------------------------------------------------------------
	// GET: Read
	//--------------------------------------------------------------------------------------------------------------------
	public function get($systemId = null) {

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
