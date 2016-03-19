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
    <!--<link rel ="stylesheet" type="text/css" href="styles/bootstrap.min.css"/>-->
    <link rel="stylesheet" type="text/css" href="styles/menu.css"/>
    <link rel="stylesheet" type="text/css" href="styles/footer.css"/>
    <link rel="stylesheet" type="text/css" href="styles/maps.css"/>
    <link rel="stylesheet" type="text/css" href="styles/popup.css">
    <link rel="stylesheet" type="text/css" href="styles/tooltips.css"/>
    <script src="js/jQuery-min.js"></script>
    <script src="js/bootstrap.min.js"/>
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
<?php include 'includes/login.php'?>
<?php include 'includes/header.php'?>


<div id="map">
    <h1>
        Du har enten deaktivert eller benytter en nettleser som ikke støtter javascript.
    </h1>
    <p>
        For å bruke dette nettstedet kreves det at javascript er aktivert. Venligst aktiver javascript for dette nettstedet, eller bytt nettleser til en som støtter javascript.
    </p>
</div>

<script>
    <?php
        //TODO: Fix it so that it works to just include the file the normal way.
        //including the content of the googlemaps javascript file
        include 'js/googlemaps.js'
    ?>
</script>

<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAijAKyJWxMHEodrkA3jD2psiz6LmI0hT8&callback=initMap&sensors=true"
        async defer></script>
<script src="js/login.js"></script>
<script src="js/addStations.js"></script>
<script src="js/maplayers.js"></script>
<script src="js/navigation.js"></script>
<script src="js/dropdown.js"></script>

<?php include 'includes/footer.php'?>
</body>
</html>