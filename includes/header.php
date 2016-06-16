<?php
/**
 * Created by PhpStorm.
 * User: jonas
 * Date: 03.03.16
 * Time: 09:50
 */
?>
<header>
    <div id="title" class="clear-both">
        <h1>elCharge</h1>
    </div>
    <div id="search">
        <button onclick="app.buttons.slideInMenu()" id="menu-toggle"></button>
        <input id="search-box" type="text"/>
        <button id="my-loc-btn" onclick="app.gps.centerOnUser(0)"><img src="icons/my_pos_marker.svg" style="width:1.5em; height:1.5em;"/></button>
        <button id="lock-to-my-pos-btn" onclick="app.buttons.lockMapToUser(this)">L</button>
    </div>

</header>
<?php
include 'menu.php';
?>
