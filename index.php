<?php
/**
 * Created by PhpStorm.
 * User: jonas
 * Date: 03.03.16
 * Time: 07:57
 * Google Maps API key: AIzaSyAijAKyJWxMHEodrkA3jD2psiz6LmI0hT8
 * NobilAPI: 274b68192b056e268f128ff63bfcd4a4
 * get all: http://nobil.no/api/server/datadump.php?apikey=274b68192b056e268f128ff63bfcd4a4&format=json&file=false
 * search box: https://developers.google.com/maps/documentation/javascript/examples/places-searchbox
 */
include 'ReadStuff.php';
?>

<!DOCTYPE html>
<html>
<head>
    <title>elCharge - ladekart for elbiler</title>
    <meta name="viewport" content="initial-scale=1.0">
    <meta charset="utf-8">
    <link rel="stylesheet" type="text/css" href="styles/all.php"/>
    <script src="https://www.google.com/jsapi"></script>
    <script src="js/jQuery-min.js"></script>
    <script>
        //TODO: REMEMBER TO REMOVE!
        /*
        var typeID=<?php
            if(!empty($_GET['type'])){
                echo $_GET['type'];
            }else{
                echo 0;
            }?>;
        function selectTypeBox(){
            document.getElementById("select_port").value = typeID;
        }
        window.onload = selectTypeBox;*/
    </script>
</head>
<body>
<?php
include 'includes/GetDownloadProgress.php';
include 'includes/login.php';
include 'includes/userwindow.php';
//Adding the header & menu elements (Menu is included in the header.php)
include 'includes/header.php';
?>


<div id="map">
    <h1>
        Du har enten deaktivert eller benytter en nettleser som ikke støtter javascript.
    </h1>
    <p>
        For å bruke dette nettstedet kreves det at javascript er aktivert. Venligst aktiver javascript for dette nettstedet, eller bytt nettleser til en som støtter javascript.
    </p>
</div>

<?php
    //placing all our scripts into the document
    include 'includes/scripts.php';
?>
</body>
</html>