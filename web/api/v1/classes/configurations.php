<?php
namespace CaF;


// Declare libraries
use \PDO;
use Respect\Rest\Routable;

class Configurations implements Routable {

	//--------------------------------------------------------------------------------------------------------------------
	// GET: Read
	//--------------------------------------------------------------------------------------------------------------------
	public function get($parameter = null) {

		// Get DB connection
		$db = Common::getDBConnection();

		// Load SQL statements
		$sqlStmts = Common::loadSqlStatements(__FILE__);

		// Prepare SQL statement
		if ($parameter == null) {
			$stmt = $db
			->prepare($sqlStmts['0001']);
		} else {
			$stmt = $db
			->prepare($sqlStmts['0002'])
			->bindParam(':parameter', $parameter, PDO::PARAM_STR, 32);
		}

		// Bind common parameters
		$stmt = $stmt
		->bindParam(':tenantId', $_SERVER['TENANT_ID'], PDO::PARAM_INT);

		// Read data and write answer (or error)
		$configuration = $stmt->execute()->fetch(PDO::FETCH_ASSOC)['configuration'];

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


