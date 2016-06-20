<?php
/**
 * Created by PhpStorm.
 * User: jonas
 * Date: 03.03.16
 * Time: 09:50
 */

 include 'includes/login.php';
?>
<header>
    <div id="title" class="clear-both">
        <h1>elCharge</h1>
        <button onclick="app.login.showForm()">Logg inn</button>
    </div>
    <div id="search">
        <button onclick="app.buttons.slideInMenu()" id="menu-toggle"></button>
        <input id="search-box" type="text"/>
        <button class="float-left nav-here">Naviger hit</button>
        <button id="my-loc-btn" onclick="app.gps.centerOnUser(0)"><img src="icons/my_pos_marker.svg" style="width:1.5em; height:1.5em;"/></button>
        <button id="lock-to-my-pos-btn" class="lock-pos" onclick="app.buttons.lockMapToUser(this)">Lock</button>
    </div>

</header>
<?php
include 'menu.php';
?>
