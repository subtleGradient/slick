<?php

// Report all errors during development
error_reporting(E_ALL);
ini_set('display_errors', '1');

// Custom error handler, to throw nice-looking error exceptions
function errorHandler($errno, $errstr, $errfile, $errline, $errcontext)
{
	$report = error_reporting();
	if ($report && $report & $errno) {
	  throw new ErrorException($errstr, 0, $errno, $errfile, $errline);
	}
}
set_error_handler('errorHandler');

include('system/index.php');?>