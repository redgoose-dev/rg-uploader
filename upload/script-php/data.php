<?php
ini_set("display_errors", 1);
error_reporting(E_ALL);
header('Access-Control-Allow-Origin: *');
header("Content-Type: text/plain");


$result = [
	[
		"id" => 8742867877,
		"name" => "https://unsplash.com/?photo=67t2GJcD5PI",
		"size" => 863489,
		"src" => "./upload/aaa.jpg",
		"type" => "image/jpeg"
	],
	[
		"id" => 6860860674,
		"name" => "aaaa.jpg",
		"size" => 506647,
		"src" => "./upload/aaaa.jpg",
		"type" => "image/jpeg"
	]
];

// print
echo json_encode($result, JSON_PRETTY_PRINT);