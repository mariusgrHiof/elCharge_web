<?php
/**
 * Created by PhpStorm.
 * User: Marius
 * Date: 5/17/2016
 * Time: 3:06 PM
 */
session_start();

if(isset($_SESSION['sessionId'])){
    session_unset();
    session_destroy();}
?>