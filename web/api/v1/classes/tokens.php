<?php
namespace CaF;

// Declare libraries
use Lcobucci\JWT\Builder;
use Lcobucci\JWT\Parser;
use Lcobucci\JWT\Signer\Hmac\Sha256;
use Respect\Rest\Routable;
use \PDO;

// Constants
define('TOKEN_TIMEOUT', 3600);

class Tokens implements \Respect\Rest\Routable {


	//--------------------------------------------------------------------------------------------------------------------
	// POST: Create token (after authenticating user)
	//--------------------------------------------------------------------------------------------------------------------
	public function post() {

		// Read payload
		$payload = json_decode(file_get_contents('php://input'), true);
		if (!$payload) {
			header('HTTP/ 404 No data', true, 404);
			print('{"errorCode": "ts-loginErrorNoData"}');
			die();
		}
		if (!array_key_exists('user', $payload) || !array_key_exists('password', $payload)) {
			print('{"errorCode": "ts-loginErrorNoData"}');
			header('HTTP/ 404 Invalid data', true, 404);
			die();
		}

		// Verify user: TODO
		if ($payload['user'] != 'alle' || $payload['password'] != 'prova') {
			print('{"errorCode": "ts-loginErrorInvalidCredentials"}');
			header('HTTP/ 401 Invalid credentials', true, 401);
			die();
		}

		// Get DB connection and load SQL statements
		$db = Common::getDBConnection();
		$sqlStmts = Common::loadSqlStatements(__FILE__);

		// Read data and write answer (or error)
		$userData = new \Ayesh\CaseInsensitiveArray\Strict(
			$db
			->prepare($sqlStmts['0001'])
			->bindParam(':tenantId', $_SERVER['TENANT_ID'], PDO::PARAM_INT)
			->bindParam(':name', $payload['user'], PDO::PARAM_STR, 64)
			->execute()->fetch(PDO::FETCH_ASSOC)
		);

		// Cleanup
		Common::closeDbConnection($db);

		// Build answer
		if ($userData['name']) {

			header("Content-type: application/json");
			$tokenExpiration = time() + TOKEN_TIMEOUT;
			$token = (new Builder())
			->setIssuer($_SERVER['TENANT_ID'])                							// Configures the issuer (iss claim)
			// ->setAudience(config_get('DNS_SUFFIX'))               					// Configures the audience (aud claim)
			->setId(base64_encode(openssl_random_pseudo_bytes(12)), false)	// Configures the id (jti claim), replicating as a header item
			->setIssuedAt(time())                                           // Configures the time that the token was issue (iat claim)
			->setNotBefore(time())                                          // Configures the time that the token can be used (nbf claim)
			->setExpiration($tokenExpiration)                        				// Configures the expiration time of the token (exp claim)
			->set('uGUID', $userData['userGUID'])                     			// Configures a new claim, called "uGUID"
			->set('uId', $userData['userId'])                     					// Configures a new claim, called "uId"
			->set('name', $userData['name'])                 								// Configures a new claim, called "name"
			->sign(new Sha256(), $_SERVER['JWT_SECRET'])           					// Sign the token
			->getToken()
			;
			$answer = array(
				'token' => (string)$token,
				'userGUID' => $userData['userGUID'],
				'expires' => $tokenExpiration
			);
			return json_encode($answer);

		} else {

			print('{"errorCode": "ts-loginErrorUserNotFound"}');
			header('HTTP/ 401 User ' . $payload['user'] . ' not found', true, 401);
			die();

		}

	}


	//--------------------------------------------------------------------------------------------------------------------
	// PUT: Refresh token
	//--------------------------------------------------------------------------------------------------------------------
	public function put() {

		// Read payload
		$payload = file_get_contents('php://input');
		if (!$payload) {
			header('HTTP/ 404 No data', true, 404);
			die();
		}

		// Decode JWT token
		try {
			$oldToken = (new Parser())->parse((string) $payload);
		} catch (Exception $e) {
			header('HTTP/ 404 Invalid data', true, 404);
			die();
		}

		header("Content-type: application/json");
		$tokenExpiration = time() + TOKEN_TIMEOUT;
		$token = (new Builder())
		->setIssuer($oldToken->getClaim('iss'))							// Clone the issuer (iss claim)
		// ->setAudience($oldToken->getClaim('aud'))						// Clone the audience (aud claim)
		->setId($oldToken->getClaim('jti'), false)					// Clone the id (jti claim), replicating as a header item
		->setIssuedAt(time())																// Configures the time that the token was issue (iat claim)
		->setNotBefore(time())															// Configures the time that the token can be used (nbf claim)
		->setExpiration(time() + $tokenExpiration)					// Configures the expiration time of the token (exp claim)
		->set('userGUID', $oldToken->getClaim('userGUID'))	// Clone custom "userGUID" claim
		->set('userId', $oldToken->getClaim('userId'))			// Clone custom "userId" claim
		->set('name', $oldToken->getClaim('name'))					// Clone custom "name" claim
		->sign(new Sha256(), $_SERVER['JWT_SECRET'])				// Sign the token
		->getToken()
		;
		$answer = array(
			'token' => (string)$token,
			'userGUID' => $oldToken->getClaim('userGUID'),
			'expires' => $tokenExpiration
		);
		return json_encode($answer);

	}

}
