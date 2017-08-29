<?php
namespace CaF;


// Declare libraries
use \PDO;

class Links {


	//--------------------------------------------------------------------------------------------------------------------
	// Manage requests
	//--------------------------------------------------------------------------------------------------------------------
	public static function manage($requestData) {

		// Verify needed data
		if (!array_key_exists('action', $requestData)) { throw new Exception('Bad format'); }

		// Get DB connection
		$db = Common::getDBConnection();

		// Load SQL statements
		$sqlStmts = Common::loadSqlStatements(__FILE__);

		switch ($requestData['action']) {

			case 'create':
			create($requestData, $db);
			break;

			default:
			Common::closeDbConnection($db);
			throw new Exception("Wrong action");
			break;
		}

		// Cleanup
		Common::closeDbConnection($db);

	}


	//--------------------------------------------------------------------------------------------------------------------
	// Create a new link
	//--------------------------------------------------------------------------------------------------------------------
	private static function create($requestData, $db) {

		// Verify needed data
		if (!array_key_exists('connectionGUID', $requestData)) { throw new Exception('Bad format'); }

		// Prepare SQL statement
		$stmt = $db
		->prepare($sqlStmts['0001'])
		->bindParam(':tenantId', $_SERVER['TENANT_ID'], PDO::PARAM_INT)
		->bindParam(':userGUID', $userGUID, PDO::PARAM_STR)
		->bindParam(':connectionId', $requestData['connectionGUID'], PDO::PARAM_STR);

		// Read connection data
		$connectionData = $stmt->execute()->fetch(PDO::FETCH_ASSOC);

		switch ($connectionData['type']) {

			case 'Shared':
			$stmt = $db
			->prepare($sqlStmts['0002'])
			->bindParam(':tenantId', $_SERVER['TENANT_ID'], PDO::PARAM_INT)
			->bindParam(':userGUID', $userGUID, PDO::PARAM_STR)
			->bindParam(':connectionId', $requestData['connectionGUID'], PDO::PARAM_STR);
			break;

			case 'Single':
			$stmt = $db
			->prepare($sqlStmts['0003'])
			->bindParam(':tenantId', $_SERVER['TENANT_ID'], PDO::PARAM_INT)
			->bindParam(':userGUID', $userGUID, PDO::PARAM_STR)
			->bindParam(':connectionId', $requestData['connectionGUID'], PDO::PARAM_STR);
			break;

			default:
			throw new Exception('Bad connection type');
			break;
		}

	}


	//--------------------------------------------------------------------------------------------------------------------
	// Create a new link
	//--------------------------------------------------------------------------------------------------------------------
	private static function reconfigure($requestData, $db) {
	}

}
