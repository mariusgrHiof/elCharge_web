<?php
/**
 * Created by PhpStorm.
 * User: jonas
 * Date: 24.03.2016
 * Time: 19.48
 *
 * Code for dividing up the datadump file into indivudual lines for each object.
 * The intention is for it to allow object to object readings from the json file.
 */
$fileName ="datadump.json";
$string = file_get_contents($fileName);
$json = json_decode($string, true);
$stations = $json['chargerstations'];

foreach ($stations as $key => $value) {
    echo json_encode($stations[$key]['csmd']['id']) . '</br>';
}
//include $fileName;
?>

