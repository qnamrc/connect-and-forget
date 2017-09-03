<?php
namespace CaF;


// Declare libraries
use Lcobucci\JWT\Parser;
use Lcobucci\JWT\Signer\Hmac\Sha256;
use Lcobucci\JWT\ValidationData;

class Auth {

	//--------------------------------------------------------------------------------------------------------------------
	// Check if request is authorized
	//--------------------------------------------------------------------------------------------------------------------
	public static function isRequestAuthorized($request_data) {

		$logger = Common::getLogger();

		// Verify Authorization data presence
		if (!array_key_exists('token', $request_data)) {
			$logger->error('Request has no auth data');
			return false;
		}

		// Verify JWT token
		$jwtToken = $request_data['token'];
		return self::verifyJWTToken($jwtToken);

	}


	//--------------------------------------------------------------------------------------------------------------------
	// Verify JWT token
	//--------------------------------------------------------------------------------------------------------------------
	public static function verifyJWTToken($jwtToken) {

		$logger = Common::getLogger();

		// Decode JWT token
		try {
			$token = (new Parser())->parse((string) $jwtToken);
		} catch (Exception $e) {
			$logger->error('Request has malformed auth data');
			return false;
		}

		// Verify signature using JWT key stored in config
		$signer = new Sha256();
		if (!$token->verify($signer, $_SERVER['JWT_SECRET'])) {
			$logger->error('Request has wrong auth signature');
			return false;
		}

		// Validate standard fields
		$expected_data = new ValidationData();
		$expected_data->setIssuer($_SERVER['TENANT_ID']);
		// $expected_data->setAudience(config_get('DNS_SUFFIX'));
		if (!$token->validate($expected_data)) {
			$logger->error('Request validation failed');
			return false;
		}

		// Extract and store custom data from token
		try {
			putenv('USER_GUID=' . $token->getClaim('uGUID'));
			putenv('USER_ID='   . $token->getClaim('uId'));
			putenv('USER_NAME=' . $token->getClaim('name'));
		} catch (Exception $e) {
			$logger->error('Request misses required fields');
			return false;
		}

		return true;

	}

}
