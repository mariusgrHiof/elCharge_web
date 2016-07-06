<?php
/**
 * Created by PhpStorm.
 * User: jonas
 * Date: 03.03.16
 * Time: 09:50
 */

include 'includes/dialogs/login.php';
include 'includes/userwindow.php';
include 'includes/dialogs/saveRoute.php';
?>
<header>
    <div id="title" class="clear-both">
        <h1>elCharge</h1>
        <button class="tooltip" onclick="app.login.showForm()"><p class="tooltiptext">Logg inn, eller registrer ny bruker</p>Logg inn</button>
    </div>
    <div id="search">
        <button onclick="app.buttons.slideInMenu()" id="menu-toggle"></button>
        <input id="search-box" type="text"/>
        <button class="float-left nav-here tooltip" onclick="navigation.fromUserSearch()"><p class="tooltiptext">Naviger hit</p>Naviger hit</button>
        <button id="my-loc-btn" class ="tooltip" onclick="app.gps.centerOnUser(0)"><p class="tooltiptext">Gå til din posisjon</p><img src="icons/my_pos_marker.svg" style="width:1.5em; height:1.5em;"/></button>
        <button id="lock-to-my-pos-btn" class="lock-pos tooltip" onclick="app.buttons.lockMapToUser(this)"><p class="tooltiptext">Lås kartet til din posisjon</p>Lock</button>
    </div>
</header>
<?php
include 'menu.php';
?>
