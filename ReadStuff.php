<?php
/**
 * Created by PhpStorm.
 * User: jonas
 * Date: 07.03.2016
 * Time: 12.03
 */
$url = "http://nobil.no/api/server/datadump.php?apikey=274b68192b056e268f128ff63bfcd4a4&countrycode=NOR&fromdate=2005-01-01&format=json";
$fileName ="datadump.json";
if(!file_exists($fileName)){
    //Downloading data dump if not already downloaded
    file_put_contents($fileName, fopen($url, 'r'));
}

/*
<html>
<!DOCTYPE html>
<head>
    <title>Test</title>
    <script src="js/stations.js"/>
    <script>

    </script>
</head>
<body>
    <?php
        include $fileName;
    ?>
</body>
</html>*/
?>


