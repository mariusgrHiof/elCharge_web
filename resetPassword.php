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

$send_using_gmail = true;

$email = 'mail@jonaskf.net';
$name = 'Jonas K Flønes';

$email_from = 'jossa90@gmail.com';
$name_from = 'Jonas K Flønes';

//Send mail using gmail
if($send_using_gmail){
   $mail->IsSMTP(); // telling the class to use SMTP
   $mail->SMTPAuth = true; // enable SMTP authentication
   $mail->SMTPSecure = "ssl"; // sets the prefix to the servier
   $mail->Host = "smtp.gmail.com"; // sets GMAIL as the SMTP server
   $mail->Port = 465; // set the SMTP port for the GMAIL server
   $mail->Username = "jossa90@gmail.com"; // GMAIL username
   $mail->Password = "P4rt1sj0n132"; // GMAIL password
}
//Typical mail data
$mail->AddAddress($email, $name);
$mail->SetFrom($email_from, $name_from);
$mail->Subject = "Snasen kaffe";
$mail->Body = "Kreft smaker godt";

try{
   $mail->Send();
   echo "Success! \r\nE=" . $mail->ErrorInfo;
} catch(Exception $e){
//Something went bad
  echo "Fail - " . $mail->ErrorInfo;
}
?>
