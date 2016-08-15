<?php
include 'dbConn.php';
//For mail contents
$resetKey = uniqid();
$resetDate = date("Y-m-d H:m:s", (time()+(60*60*24)));
$userMail = 'mail@jonaskf.net';
$user = $conn->query("select username from ec_user where mail='" . filter_var($userMail, FILTER_SANITIZE_STRING) . "';")->fetch_assoc()['username'];

$conn->query('UPDATE `ec_user` SET `reset_key`=\''. $resetKey .'\', `reset_key_time`=\''. $resetDate .'\' WHERE `mail`=\''. filter_var($userMail, FILTER_SANITIZE_STRING) .'\';');

//Sending the mail
require 'PHPMailer/PHPMailerAutoload.php';
$mail = new PHPMailer(false);
$mail->SMTPOptions = array(
    'ssl' => array(
        'verify_peer' => false,
        'verify_peer_name' => false,
        'allow_self_signed' => true
    )
);

$send_using_gmail = true;

//SMTP
if($send_using_gmail){
  //For testing purposes
  $email_from = 'jossa90@gmail.com';
  $name_from = 'no-reply@hiof.no';

  $mail->IsSMTP(); // telling the class to use SMTP
  $mail->SMTPAuth = true; // enable SMTP authentication
  $mail->SMTPSecure = "ssl"; // sets the prefix to the servier
  $mail->Host = "smtp.gmail.com"; // sets GMAIL as the SMTP server
  $mail->Port = 465; // set the SMTP port for the GMAIL server
  $mail->Username = "jossa90@gmail.com"; // GMAIL username
  $mail->Password = "P4rt1sj0n132"; // GMAIL password
}else{
  $email_from = 'no-reply@hiof.no';
  $name_from = 'no-reply hiof';

  $mail->IsSMTP();
  $mail->SMTPAuth = false;
  $mail->SMTPSecure = "ssl";
  $mail->Host = "smtp.hiof.no";
  $mail->Port = 465;
  $mail->Username = "";
  $mail->Password = "";
}

//Typical mail data
$mail->CharSet = 'UTF-8';
$mail->IsHTML(true);
$mail->AddAddress($userMail, $userMail);
$mail->SetFrom($email_from, $name_from);
$mail->Subject = "[Elbil] Glemt passord";
ob_start();
include_once('resetPasswordBody.php');
$contentBody = ob_get_contents();
$mail->Body = $contentBody;
ob_end_clean();

try{
   $mail->Send();
   echo "Du mottar mailen innen kort tid! " . $mail->ErrorInfo;
} catch(Exception $e){
//Something went bad
  echo "Det skjedde en feil! " . $mail->ErrorInfo;
}
?>
