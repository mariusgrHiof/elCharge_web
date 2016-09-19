<?php
header('content-type: application/json; charset=utf-8');
header("access-control-allow-origin: *");
header("Access-Control-Allow-Headers: *");
//Reflecting whats in the Nobil API with a secure response
$action = 'datadump';
echo file_get_contents('../datadump.json');
//echo file_get_contents('http://nobil.no/api/server/datadump.php?&apikey=274b68192b056e268f128ff63bfcd4a4&apiversion=3&action='. $action.'&fromdate='. $_GET['fromdate']);
?>
