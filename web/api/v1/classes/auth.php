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
	public static function isRequestAuthorized($pattern) {
		function endWithError($errorCode) {
			// print "{\"errorMessage\": \"$errorCode\"}";
			http_response_code(401);
			header("WWW-Authenticate: JWT");
			return false;
		}

		// The '/tokens' pattern is used to get authentication tokens, so let the request flow
		if ($pattern == '/tokens') { return true; }

		// Verify Authorization data presence
		if (!array_key_exists('HTTP_AUTHORIZATION', $_SERVER)) { return endWithError('ts-authBadAuthData'); }

		// Verify
		$authHeader = explode(' ', $_SERVER['HTTP_AUTHORIZATION']);
		if (count($authHeader) < 2) { return endWithError('ts-authBadAuthData'); }

		// Split authorization data
		$authMethod = $authHeader[0];
		$jwtToken = $authHeader[1];

		// Verify Authorization method
		if ($authMethod != 'Bearer') { return endWithError('ts-authWrongMethod'); }

		// Verify JWT token
		return Auth::verifyJWTToken($jwtToken);

	}


	//--------------------------------------------------------------------------------------------------------------------
	// Verify JWT token
	//--------------------------------------------------------------------------------------------------------------------
	public static function verifyJWTToken($jwtToken) {

		// Decode JWT token
		try {
			$token = (new Parser())->parse((string) $jwtToken);
		} catch (Exception $e) {
			// print('{"errorMessage": "ts-authBadauthHeader"}');
			return false;
		}

		// Verify signature using JWT key stored in config
		$signer = new Sha256();
		if (!$token->verify($signer, $_SERVER['JWT_SECRET'])) {
			// print('{"errorMessage": "ts-authBadSignature"}');
			return false;
		}

		// Validate standard fields
		$expected_data = new ValidationData();
		$expected_data->setIssuer($_SERVER['TENANT_ID']);
		// $expected_data->setAudience(config_get('DNS_SUFFIX'));
		if (!$token->validate($expected_data)) {
			// print('{"errorMessage": "ts-authBadauthHeader"}');
			return false;
		}

		// Extract and store custom data from token
		try {
			putenv('USER_GUID=' . $token->getClaim('uGUID'));
			putenv('USER_ID='   . $token->getClaim('uId'));
			putenv('USER_NAME=' . $token->getClaim('name'));
			putenv('JWT_TOKEN=' . $jwtToken);
		} catch (Exception $e) {
			// print('{"errorMessage": "ts-authBadauthHeader"}');
			return false;
		}

		return true;

	}

}
