<?php

ini_set("display_errors", 1);
error_reporting(E_ALL);
header("Content-Type: text/plain");


// set directory
$pwd_root = '../';
$pwd = '../upload';
$dir = './upload';

// set file value
$file = $_FILES['file'];


function result($type, $response)
{
	echo urlencode(json_encode([
		'state' => $type,
		'response' => $response
	]));
	exit;
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

if (!$file['name'])
{
	result('error', [ 'message' => 'not found $file[name]' ]);
}

$filename = $file['name'];

if (file_exists($pwd.'/'.$filename))
{
	result('error', [ 'message' => 'file exists' ]);
}

// upload file
if (move_uploaded_file($file['tmp_name'], $pwd.'/'.$filename))
{
	result('success', [ 'src' => $dir.'/'.$filename ]);
}
else
{
	result('error', [ 'message' => 'file upload fail' ]);
}
