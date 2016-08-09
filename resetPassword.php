<?php
require 'api/PHPMailer/PHPMailerAutoload.php';
$mail = new PHPMailer(false);
$mail->SMTPOptions = array(
    'ssl' => array(
        'verify_peer' => false,
        'verify_peer_name' => false,
        'allow_self_signed' => true
    )
);

$email = 'mail@jonaskf.net';
$name = 'Jonas K F';
$send_using_gmail = true;

//SMTP
if($send_using_gmail){
  $email_from = 'jossa90@gmail.com';
  $name_from = 'Jonas K Flønes';

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
$mail->AddAddress($email, $name);
$mail->SetFrom($email_from, $name_from);
$mail->Subject = "[Elbil] Lag nytt passord";
$mail->Body = "Sjokolade smaker godt";

try{
   $mail->Send();
   echo "Success! <br>" . $mail->ErrorInfo;
} catch(Exception $e){
//Something went bad
  echo "Fail - " . $mail->ErrorInfo;
}
?>
