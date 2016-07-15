<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
echo '2';
try{
  ini_set("SMTP", "smtp.hiof.no");
  ini_set("sendmail_from", "no-reply@hiof.no");

  $message = "En test mail";

  $headers = "From: no-reply@hiof.no";

  mail("mail@jonaskf.net", "Testing", $message, $headers);
  echo "Sendt?<BR/>";
}catch(Exception $e){
  echo $e;
}
