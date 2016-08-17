<?php
include 'dbConn.php';
//For mail contents
if(!isset($_POST['resetkey'])){
  $resetKey = uniqid();
  $resetDate = date("Y-m-d H:m:s", (time()+(60*60*24)));
  $userMail = $_POST['mail'];
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

  $send_using_gmail = false;

  //SMTP
  if($send_using_gmail){
    //For testing purposes
    $email_from = '';
    $name_from = 'no-reply@hiof.no';

    $mail->IsSMTP(); // telling the class to use SMTP
    $mail->SMTPAuth = true; // enable SMTP authentication
    $mail->SMTPSecure = "ssl"; // sets the prefix to the servier
    $mail->Host = "smtp.gmail.com"; // sets GMAIL as the SMTP server
    $mail->Port = 465; // set the SMTP port for the GMAIL server
    $mail->Username = $email_from; // GMAIL username
    $mail->Password = ""; // GMAIL password
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
    if(strlen($user) > 0){
     $mail->Send();
    }
    //Telling the user that the mail is sent regardless, for security reasons
     echo "Du mottar mailen innen kort tid! " . $mail->ErrorInfo;
  } catch(Exception $e){
  //Something went bad
    echo "Det skjedde en feil! " . $mail->ErrorInfo;
  }
}else{
  $username = filter_var($_POST['username'], FILTER_SANITIZE_STRING);
  $newPassword = $_POST['password'];
  $rePassword = $_POST['rePassword'];
  $resetKey = $_POST['resetkey'];
  $currentResetKey = $conn->query("select reset_key from ec_user where username='" . $username . "';")->fetch_assoc()['reset_key'];
  echo 'user: ' .$username . '<br> ';
  echo 'pw1: ' . $newPassword . '<br> ';
  echo 'pw2: ' . $rePassword . '<br> ';
  echo 'resetkey ' . $resetKey . ' ==? ' . $currentResetKey;
  try{
    if( $newPassword == $rePassword && $resetKey == $currentResetKey ){
      $conn->query('UPDATE `ec_user` SET `password`=\''. password_hash(filter_var($newPassword, FILTER_SANITIZE_STRING), PASSWORD_DEFAULT) .'\' WHERE `username`=\''. $username .'\';');
    }else{
      echo 'Passordene er ikke like!';
    }
  }catch(Exception $e){
    echo 'Noe gikk galt';
  }
}
?>
