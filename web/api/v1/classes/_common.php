<?php
namespace CaF;


use \Pheanstalk\Pheanstalk as Pheanstalk;


abstract class Common {


	//########################################################################################################################
	// Close DB connection
	//########################################################################################################################
	public static function closeDBConnection(&$connection) {
		$connection = null;
	}


	//########################################################################################################################
	// Get JobQueue connection
	//########################################################################################################################
	public static function getJQConnection() {
		return new Pheanstalk($_SERVER['JQ_HOST'] . ($_SERVER['JQ_PORT'] == '' ? '' : ':' . $_SERVER['JQ_PORT']));
	}


	//########################################################################################################################
	// Get DB connection
	//########################################################################################################################
	public static function getDBConnection() {
		try {
			return new \RoyallTheFourth\SmoothPdo\DataObject(new \PDO(
				'pgsql:host=' . $_SERVER['DB_HOST'] . ';dbname=' . $_SERVER['DB_NAME'],
				$_SERVER['DB_USER'],
				$_SERVER['DB_PASS']
			));
		} catch(Exception $e) {
			header('HTTP/ 500 ' . $e->getMessage(), true, 500);
			die();
		}
	}


	//########################################################################################################################
	// Get logger instance
	//########################################################################################################################
	public static function getLogger() {
		static $logger;
		if ($logger == null) {
			$logger = new \Katzgrau\KLogger\Logger('/tmp/web');
		}
		return $logger;
	}


	//########################################################################################################################
	// Verify UUID
	//########################################################################################################################
	public static function isUUIDValid($uuid) {
		return (preg_match('/[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-(8|9|a|b)[a-f0-9]{3}-[a-f0-9]{12}/', $uuid) == 1);
	}


	//########################################################################################################################
	// Load SQL statements
	//########################################################################################################################
	public static function loadSqlStatements($moduleName) {
		// if ($p = strrpos($moduleName, '\\')) { $moduleName = strtolower(substr($moduleName, $p + 1)); }

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
			$sqlStmts["$id"] = "$sql";
		}

		return $sqlStmts;

	}

}
