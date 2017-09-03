<?php
namespace CaF;


class Common {

	const CONNECTIONS_DIR = '/tmp/connectandforget'; // TODO: '/var/lib/connectandforget';


	//--------------------------------------------------------------------------------------------------------------------
	// Close DB connection
	//--------------------------------------------------------------------------------------------------------------------
	public static function closeDBConnection(&$connection) {
		$connection = null;
	}


	//--------------------------------------------------------------------------------------------------------------------
	// Get DB connection
	//--------------------------------------------------------------------------------------------------------------------
	public static function getDBConnection() {
		try {
			return new \RoyallTheFourth\SmoothPdo\DataObject(new \PDO(
				'pgsql:service=t' . $_SERVER['TENANT_ID']
			));
		} catch(Exception $e) {
			die();
		}
	}


	//--------------------------------------------------------------------------------------------------------------------
	// Get Job Queue connection
	//--------------------------------------------------------------------------------------------------------------------
	public static function getJQConnection() {
		return new \Pheanstalk\Pheanstalk($_SERVER['JQ_HOST'] . ($_SERVER['JQ_PORT'] == '' ? '' : ':' . $_SERVER['JQ_PORT']));
	}


	//--------------------------------------------------------------------------------------------------------------------
	// Get logger instance
	//--------------------------------------------------------------------------------------------------------------------
	public static function getLogger() {
		static $logger;
		if ($logger == null) {
			$logger = new \Katzgrau\KLogger\Logger('/tmp/connector');
		}
		return $logger;
	}


	//--------------------------------------------------------------------------------------------------------------------
	// Verify UUID
	//--------------------------------------------------------------------------------------------------------------------
	public static function isUUIDValid($uuid) {
		return (preg_match('/[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-(8|9|a|b)[a-f0-9]{3}-[a-f0-9]{12}/', $uuid) == 1);
	}


	//--------------------------------------------------------------------------------------------------------------------
	// Load SQL statements
	//--------------------------------------------------------------------------------------------------------------------
	public static function loadSqlStatements($moduleName) {

		// Verify file exists
		$moduleName = pathinfo($moduleName, PATHINFO_FILENAME);
		$xmlFile = getenv('ROOT_DIR') . '/sql/' . $moduleName . '.xml';
		if (!file_exists($xmlFile)) { return; }

		// Read XML file and parse statements
		$xml = simplexml_load_file($xmlFile)->xpath('/statements/sql');

		// Build SQL statements array
		$sqlStmts = array();
		foreach ($xml as $i => $sql) {
			$id = $sql->attributes();
			$sqlStmts["$id"] = (string)$sql;
		}

		return $sqlStmts;

	}


	//--------------------------------------------------------------------------------------------------------------------
	// Load system commands
	//--------------------------------------------------------------------------------------------------------------------
	public static function loadSystemCommands($moduleName) {

		// Verify file exists
		$moduleName = pathinfo($moduleName, PATHINFO_FILENAME);
		$xmlFile = getenv('ROOT_DIR') . '/cmd/' . $moduleName . '.xml';
		if (!file_exists($xmlFile)) { return; }

		// Read XML file and parse statements
		$xml = simplexml_load_file($xmlFile)->xpath('/statements/cmd');

		// Build SQL statements array
		$systemCommands = array();
		foreach ($xml as $i => $cmd) {
			$id = $cmd->attributes();
			$systemCommands["$id"] = (string)$cmd;
		}

		return $systemCommands;

	}


	//--------------------------------------------------------------------------------------------------------------------
	// Get Message Queue connection
	//--------------------------------------------------------------------------------------------------------------------
	public static function mqPublish($topic, $content, $qos = 0, $retain = 0) {

		$logger = self::getLogger();

		// Try to publish
		$published = false;
		$mq = new \phpMQTT($_SERVER['MQ_HOST'], $_SERVER['MQ_PORT'], 'backend');	// TODO: fix client name
		if ($mq->connect(true, NULL, $_SERVER['MQ_USERNAME'], $_SERVER['MQ_PASSWORD'])) {
			$mq->publish($_SERVER['MQ_PREFIX'] . $topic, $content, $qos, $retain);
			$mq->close();
			$logger->debug("Published $content to $topic");
			return true;
		}

		// Log errors or success
		$logger->error("Couldn't publish $content to $topic");
		return false;

	}


	//--------------------------------------------------------------------------------------------------------------------
	// Read local copy of link data
	//--------------------------------------------------------------------------------------------------------------------
	public static function readLocalLinkData($linkGUID, &$linkData) {

		$localFileName = self::CONNECTIONS_DIR . '/' . $linkGUID . '.data';
		if (file_exists($localFileName)) {
			$linkData = json_decode(file_get_contents($localFileName));
			return true;
		}

		return false;
	}


	//--------------------------------------------------------------------------------------------------------------------
	// Write local copy of link data
	//--------------------------------------------------------------------------------------------------------------------
	public static function writeLocalLinkData($linkGUID, $linkData) {

		// Create dir if not exist
		if (!file_exists(self::CONNECTIONS_DIR)) { mkdir(self::CONNECTIONS_DIR); }

		// Fix link data (object -> array)
		if (gettype($linkData) == 'array') {
			$outData = $linkData;
		} else {
			$outData = [];
			while ($linkData->valid()) {
				$outData[$linkData->key()] = $linkData->current();
				$linkData->next();
			}
		}

		return file_put_contents(self::CONNECTIONS_DIR . '/' . $linkGUID . '.data', json_encode($outData, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));

	}

}
