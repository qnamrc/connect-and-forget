<?php
namespace CaF;


// Declare libraries
use \PDO;

class TablesCache {


	//--------------------------------------------------------------------------------------------------------------------
	// Manage requests
	//--------------------------------------------------------------------------------------------------------------------
	public static function manage($requestData) {

		$logger = Common::getLogger();

		// Verify needed data
		if (!array_key_exists('action', $requestData)) {
			$logger->error("TablesCache: missing action field");
			return false;
		}

		// Get DB connection
		$db = Common::getDBConnection();

		// Load SQL statements
		$sqlStmts = Common::loadSqlStatements(__FILE__);

		$action = $requestData['action'];
		switch ($action) {

			case 'update':
			$logger->debug("TablesCache: update");
			$result = self::update($requestData, $db, $sqlStmts, $logger);
			Common::closeDbConnection($db);
			return $result;

			default:
			$logger->error("TablesCache: unknown action ($action)");
			Common::closeDbConnection($db);
			return false;

		}

	}


	//--------------------------------------------------------------------------------------------------------------------
	// Update tables cache
	//--------------------------------------------------------------------------------------------------------------------
	private static function update($requestData, $db, $sqlStmts, $logger) {

		// Verify needed data
		if (!array_key_exists('tableName', $requestData)) {
			$logger->error("TablesCache: missing tableName field");
			return false;
		}

		$tableName = $requestData['tableName'];
		switch ($tableName) {

			case 'destinations':
			$logger->debug("TablesCache: update destinations");
			return self::updateDestinations($requestData, $db, $sqlStmts, $logger);

			default:
			$logger->error("TablesCache: unknown tableName ($tableName)");
			return false;

		}

	}


	//--------------------------------------------------------------------------------------------------------------------
	// Update destinations
	//--------------------------------------------------------------------------------------------------------------------
	private static function updateDestinations($requestData, $db, $sqlStmts, $logger) {

		// Verify needed data
		if (!array_key_exists('destinationGUID', $requestData)) {
			$logger->error("TablesCache: missing destinationGUID field");
			return false;
		}
		$destinationGUID = $requestData['destinationGUID'];
		$logger->debug("TablesCache: update destination $destinationGUID");

		// Update destinations data and write answer (or error)
		$changedUserGUIDs = new \Ayesh\CaseInsensitiveArray\Strict(
			$db
			->prepare($sqlStmts['0001'])
			->bindParam(':tenantId', $_SERVER['TENANT_ID'], PDO::PARAM_INT)
			->bindParam(':destinationGUID', $destinationGUID, PDO::PARAM_STR, 36)
				->execute()->fetchAll(PDO::FETCH_COLUMN, 0)
		);
		$logger->debug('changedUserGUID: ' . json_encode(array_unique($changedUserGUIDs)));

		// Broadcast update
		if (count($changedUserGUIDs) > 0) {
			Common::mqPublish("destinations/$destinationGUID", json_encode(array_unique($changedUserGUIDs)));
		}

	}

}
