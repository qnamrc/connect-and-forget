<?php

// Includes
require_once(__DIR__ . '/../vendor/autoload.php');


// Declare libraries
use Respect\Rest\Router;
use Respect\Rest\Routable;
use CaF\Auth;


// REST objects classes
use CaF\Connections;
use CaF\Configurations;
use CaF\Destinations;
use CaF\Links;

use CaF\ConnectionsCache;
use CaF\DestinationsCache;
use CaF\SystemsCache;

use CaF\Tokens;


//########################################################################################################################
// MAIN
//########################################################################################################################

// print('<pre>');
// print('$_SERVER: ');  print_r($_SERVER);
// print('$_REQUEST: '); print_r($_REQUEST);
// print('$_FILES: ');   print_r($_FILES);
// print('$_COOKIE: ');  print_r($_COOKIE);
// print('</pre>');

// Store root path into a variable
putenv('ROOT_DIR=' . dirname(__FILE__));

// Create a router instance
$rest = new Router('/api/v1');

// Check request authorization
$rest->always('By', function() use($rest) {
	return Auth::isRequestAuthorized($rest->request->route->pattern);
});

// Generic error handler
// $rest->errorRoute(function (array $error) {
// 	return '<pre>Sorry, this errors happened: ' . var_dump($error) . '</pre>';
// });

// Methods handlers
$rest->any('/connections/*', new Connections());
$rest->any('/configurations/*', new Configurations());
$rest->any('/destinations/*', new Destinations());
$rest->any('/links/*', new Links());
$rest->any('/tablescache/connections/*/*', new ConnectionsCache());
$rest->any('/tablescache/destinations/*/*', new DestinationsCache());
$rest->any('/tablescache/systems/*', new SystemsCache());

$rest->any('/tokens', new Tokens());
