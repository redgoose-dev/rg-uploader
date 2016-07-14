<?php

ini_set("display_errors", 1);
error_reporting(E_ALL);

$dir = './upload';

$result = [
	"foo" => "bar"
];

echo json_encode($result, JSON_PRETTY_PRINT);