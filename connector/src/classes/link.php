<?php
namespace CaF;


// Declare libraries
use \PDO;


abstract class Link {


	//--------------------------------------------------------------------------------------------------------------------
	// Manage requests
	//--------------------------------------------------------------------------------------------------------------------
	public static function manage($requestData) {

		$logger = Common::getLogger();

		// Get DB connection and load SQL statements
		$db = Common::getDBConnection();
		$sqlStmts = Common::loadSqlStatements(__FILE__);

		$action = $requestData['action'];
		switch ($action) {

			case 'enable':
			$logger->debug(get_class() . ': enable');
			$result = self::enable($requestData, $db, $sqlStmts, $logger);
			Common::closeDbConnection($db);
			return $result;

			case 'disable':
			$logger->debug(get_class() . ': disable');
			$result = self::disable($requestData, $db, $sqlStmts, $logger);
			Common::closeDbConnection($db);
			return $result;

			case 'restart':
			$logger->debug(get_class() . ': restart');
			$result = self::restart($requestData, $db, $sqlStmts, $logger);
			Common::closeDbConnection($db);
			return $result;

			default:
			$logger->error(get_class() . ': unknown action (' . $action . ')');
			Common::closeDbConnection($db);
			return false;
		}

	}


	//--------------------------------------------------------------------------------------------------------------------
	// Enable (and connect) link
	//--------------------------------------------------------------------------------------------------------------------
	private static function enable($requestData, $db, $sqlStmts, $logger) {

		// TODO: Advance connection status

		// Get system commands
		$systemCommands = Common::loadSystemCommands(__FILE__);

		// Try to read local link data
		if (!Common::readLocalLinkData($requestData['linkGUID'], $linkData)) {

			// Read link data from DB
			$linkData = $db
			->prepare($sqlStmts['0001'])
			->bindParam(':tenantId', $_SERVER['TENANT_ID'], PDO::PARAM_INT)
			->bindParam(':linkGUID', $requestData['linkGUID'], PDO::PARAM_STR, 36)
			->bindParam(':userGUID', $requestData['userGUID'], PDO::PARAM_STR)
			->execute()->fetch(PDO::FETCH_ASSOC);
			$linkData['ipaddresses'] = json_decode($linkData['ipaddresses'], true);
			$linkData['configdata'] = json_decode($linkData['configdata'], true);
			$linkData = new \Ayesh\CaseInsensitiveArray\Strict($linkData);

			// Connect link
			self::connect($requestData, $linkData, $db, $systemCommands, $sqlStmts, $logger);

			// Write local link data
			Common::writeLocalLinkData($requestData['linkGUID'], $linkData);

		}

		$cmd = new SystemCommand();

		// Add (or replace) iptables mangle rules
		$cmd
		->setCommandString($systemCommands['0001'])
		->bindParam(':nic', $_SERVER['CONNECTOR']['IN_IFACE'], 16)
		->bindParam(':ipAddress', $requestData['ipAddress'], 46)
		->bindParam(':subnet', $linkData['subnet'], 46)
		->bindParam(':fwMark', $linkData['fwMark'], 4)
		->execute();

		// TODO: Advance connection status

		return true;

	}


	//--------------------------------------------------------------------------------------------------------------------
	// Disable (and disconnect) link
	//--------------------------------------------------------------------------------------------------------------------
	private static function disable($requestData, $db, $sqlStmts, $logger) {
		return true;
	}


	//--------------------------------------------------------------------------------------------------------------------
	// Restart link
	//--------------------------------------------------------------------------------------------------------------------
	private static function restart($requestData, $db, $sqlStmts, $logger) {
		return true;
	}


	//--------------------------------------------------------------------------------------------------------------------
	// Connect link
	//--------------------------------------------------------------------------------------------------------------------
	private static function connect($requestData, &$linkData, $db, $systemCommands, $sqlStmts, $logger) {

		// Read all connections data and build the (sorted) list of used linkIds
		$linkIds = [];
		foreach (scandir(Common::CONNECTIONS_DIR) as $fileName) {
			if (!pathinfo($fileName, PATHINFO_EXTENSION) == 'data') { continue; }

			$linkData = json_decode(file_get_contents(Common::CONNECTIONS_DIR . '/' . $fileName), true);
			if (!array_key_exists('linkId', $linkData)) { continue; }

			$linkIds[$linkData['linkId']] = $linkData['linkId'];
		}
		ksort($linkIds);

		// Find the first (free) linkId to use
		$linkId = 0;
		for ($i = 1; $i <= count($linkIds) + 1; $i++) {

			// If the linkId is in the list, skip it
			if (array_key_exists($i, $linkIds)) { continue; }

			// Unused linkId found
			$linkId = $i;
			break;
		}

		// If something went wrong, exit
		if ($linkId == 0) {
			$logger->error('Cannot get a linkId');
			die();
		}

		// Store link data
		$linkData->offsetSet('linkId', $linkId);
		$linkData->offsetSet('fwMark', '0x' . dechex($linkId));

		// Bring link up (technology-specific)
		static::bringUp($requestData, $linkData, $db, $sqlStmts, $logger);

		$cmd = new SystemCommand();

		// Add (or replace) ip (routing) rules
		$cmd
		->setCommandString($systemCommands['0002'])
		->bindParam(':fwMark', $linkData['fwMark'], 4)
		->bindParam(':linkId', $linkData['linkId'], 3)
		->execute();

	}


	//--------------------------------------------------------------------------------------------------------------------
	// Disconnect link
	//--------------------------------------------------------------------------------------------------------------------
	private static function disconnect($requestData, &$linkData, $db, $systemCommands, $sqlStmts, $logger) {
		static::bringDown($requestData, $linkData, $db, $sqlStmts, $logger);
	}


	//--------------------------------------------------------------------------------------------------------------------
	// Bring link up
	//--------------------------------------------------------------------------------------------------------------------
	protected abstract static function bringUp($requestData, &$linkData, $db, $sqlStmts, $logger);


	//--------------------------------------------------------------------------------------------------------------------
	// Bring link down
	//--------------------------------------------------------------------------------------------------------------------
	protected abstract static function bringDown($requestData, &$linkData, $db, $sqlStmts, $logger);

}
