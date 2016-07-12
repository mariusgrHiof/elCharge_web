<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

echo '2';
 include "api/Mail.php";

 $from = "No-reply <no-reply@hiof.no>";
 $to = "Jonas K Flønes <mail@jonaskf.com>";
 $subject = "No reply test";
 $body = "Test testersen";
 echo '8';
 $host = "mail.hiof.no";
 $username = "";
 $password = "";
 echo '12;'
 $headers = array ('From' => $from,
   'To' => $to,
   'Subject' => $subject);
 $smtp = Mail::factory('smtp',
   array ('host' => $host,
     'auth' => true,
     'username' => $username,
     'password' => $password));
 echo '21';
 $mail = $smtp->send($to, $headers, $body);
 echo '23';
 if (PEAR::isError($mail)) {
   echo("<p>" . $mail->getMessage() . "</p>");
  } else {
   echo("<p>Message successfully sent!</p>");
  }
 ?>
