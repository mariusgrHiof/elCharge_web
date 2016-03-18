<?php
/**
 * Created by PhpStorm.
 * User: jonas
 * Date: 03.03.16
 * Time: 09:50
 */
?>
<header>
    <div id="title">
        <button onclick="dropdown(this, true)" id="menu-toggle"></button>
        <h1>elCharge</h1>
    </div>
    <div id="search">
        <input type="text"/>
        <button>Søk</button>
        <div id="title-login">
            <button class="show-login"> Logg inn </button>
        </div>
    </div>
    <?php include 'menu.php'?>

</header>
