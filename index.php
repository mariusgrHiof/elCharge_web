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
    <!-- Meta -->
    <meta name="format-detection" content="telephone=no" />
    <meta name="msapplication-tap-highlight" content="no" />
    <meta name="viewport" content="user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width" />
    <!-- This is a wide open CSP declaration. To lock this down for production, see below. -->
    <meta http-equiv="Content-Security-Policy" content="default-src * 'unsafe-inline'; style-src 'self' 'unsafe-inline'; media-src *" />
    <meta charset="utf-8">
    <!-- Stylesheets-->
    <link rel="stylesheet" type="text/css" href="styles/menu.css"/>
    <link rel="stylesheet" type="text/css" href="styles/tooltips.css"/>
    <link rel="stylesheet" type="text/css" href="styles/text.css"/>
    <link rel="stylesheet" type="text/css" href="styles/tablet.css"/>
    <link rel="stylesheet" type="text/css" href="styles/mobile.css"/>
    <link rel="stylesheet" type="text/css" href="styles/maps.css"/>
    <link rel="stylesheet" type="text/css" href="styles/login.css"/>
    <link rel="stylesheet" type="text/css" href="styles/colors.css"/>
    <link rel="stylesheet" type="text/css" href="styles/download.css"/>
    <link rel="stylesheet" type="text/css" href="styles/footer.css"/>
    <!-- Scripts -->
    <script src="js/include.js"></script>
    <script src="https://www.google.com/jsapi"></script>
    <script src="js/jQuery-min.js"></script>
</head>
<body>
<?php
include 'includes/GetDownloadProgress.php';
include 'includes/login.php';
include 'includes/userwindow.php';
//Adding the header & menu elements (Menu is included in the header.php)
//include 'includes/header.php';
?>
<header include="includes/header.html">

</header>

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