<?php
ini_set("display_errors", 1);
error_reporting(E_ALL);
header('Access-Control-Allow-Origin: *');
header("Content-Type: text/json");


// set directory
$pwd_root = '../';
$pwd = '../upload';
$dir = $_POST['dir'] ? $_POST['dir'] : './upload';


// check value
if (!isset($_FILES['file']))
{
	result('error', [ 'message' => 'not found $_FILES[file]' ]);
}


// set file value
$file = $_FILES['file'];


// result render
function result($type, $response)
{
	echo json_encode([
		'state' => $type,
		'response' => $response
	], JSON_PRETTY_PRINT);
	exit;
}

// make unique filename
function makeFilename()
{
	global $file;
	return strtotime(date('Y-m-d H:i:s')).'-'.rand(10000,99999).'.'.pathinfo($file['name'], PATHINFO_EXTENSION);
}

// detect mobile
function detectMobile()
{
	return $isMobile = (bool)preg_match('#\b(ip(hone|od|ad)|android|opera m(ob|in)i|windows (phone|ce)|blackberry|tablet'.
		'|s(ymbian|eries60|amsung)|p(laybook|alm|rofile/midp|laystation portable)|nokia|fennec|htc[\-_]'.
		'|mobile|up\.browser|[1-4][0-9]{2}x[1-4][0-9]{2})\b#i', $_SERVER['HTTP_USER_AGENT'] );
}


// check directory
if (!is_dir($pwd))
{
	if (is_writable($pwd_root))
	{
		$umask = umask();
		umask(000);
		mkdir($pwd, 0707);
		umask($umask);
	}

	if (!is_dir($pwd))
	{
		result('error', [ 'message' => 'not exist "'.$pwd.'" directory' ]);
	}
}


// set filename
if (detectMobile())
{
	$filename = makeFilename();
}
else
{
	$filename = preg_replace("/\s+/", "_", $file['name']);
}


// file check
if (file_exists($pwd.'/'.$filename))
{
	result('error', [ 'message' => 'file exists' ]);
}

// upload file
if (!move_uploaded_file($file['tmp_name'], $pwd.'/'.$filename))
{
	result('error', [ 'message' => 'file upload fail' ]);
}

// DB UPDATE

// goal
result('success', [
	'db_id' => rand(10000,99999),
	'src' => $dir.'/'.$filename,
	'name' => $filename
]);
