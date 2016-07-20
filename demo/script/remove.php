<?php
ini_set("display_errors", 1);
error_reporting(E_ALL);
header("Content-Type: text/plain");


// set directory
$pwd_root = '../';
$pwd = '../upload';
$dir = './upload';


// result render
function result($type, $response)
{
	echo json_encode([
		'state' => $type,
		'response' => $response
	], JSON_PRETTY_PRINT);
	exit;
}


// remove
if (isset($_POST['name']) && file_exists($pwd.'/'.$_POST['name']))
{
	unlink($pwd.'/'.$_POST['name']);
	result('success', []);
}
else
{
	result('error', []);
}
