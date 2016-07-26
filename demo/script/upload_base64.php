<?php
ini_set("display_errors", 1);
error_reporting(E_ALL);
header("Content-Type: plain/text");


// set directory
$pwd = '../upload';
$dir = './upload';
$prefix = 'thumb-';


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
function generateRandomString($length = 10) {
	$characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	$charactersLength = strlen($characters);
	$randomString = '';
	for ($i = 0; $i < $length; $i++) {
		$randomString .= $characters[rand(0, $charactersLength - 1)];
	}
	return $randomString;
}


// check post value
if (!$_POST['name'] || !$_POST['image'] || !$_POST['id'])
{
	result('error', [ 'message' => 'not found $_POST' ]);
}


// adjust image data
$imgData = str_replace('data:image/jpeg;base64,', '', $_POST['image']);
$imgData = str_replace(' ', '+', $imgData);
// set filename
$filename = $prefix.generateRandomString(15).'.'.pathinfo($_POST['name'])['extension'];
// set location
$loc = $pwd.'/'.$filename;

// upload image
$result = file_put_contents($loc, base64_decode($imgData));


// print result
if ($result)
{
	result('success', [
		'id' => (int)$_POST['id'],
		'name' => $filename,
		'src' => $dir.'/'.$filename,
		'size' => filesize($loc),
		'type' => mime_content_type($loc)
	]);
}
else
{
	result('error', [ 'message' => 'upload error' ]);
}
