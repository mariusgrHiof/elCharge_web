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
session_set_cookie_params(7200,"/");
session_start();
/*
 * For writing contents to file for phonegap -> Keep in mind that you need to
 * delete index.html if you want to have it updated with the latest version of the webapp!
 */

ob_start();
?>

<!DOCTYPE html>
<html>
<?php include 'includes/head.php';?>
<body>
<?php
include 'includes/getDownloadProgress.php';
//Adding the header & menu elements (Menu is included in the header.php)
include 'includes/header.php';
include 'includes/map.php';
include 'includes/scripts.php';
?>

<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-80637419-1', 'auto');
  ga('send', 'pageview');

</script>
</body>
</html>
<?php
$mobileSite = ob_get_contents();
$index ="main.html";
if(!file_exists($index)){
    //Writing index.html file off the contents of the website
    file_put_contents($index, $mobileSite);
}else{
    //jkjk writing to file anyways :)
    file_put_contents($index, $mobileSite);
}
?>
