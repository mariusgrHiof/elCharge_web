<?php
/**
 * Created by PhpStorm.
 * User: jonas
 * Date: 03.03.16
 * Time: 09:50
 */

include 'includes/dialogs/login.php';
include 'includes/dialogs/userwindow.php';
include 'includes/dialogs/saveRoute.php';
?>
<header>
    <div id="title" class="clear-both">
        <h1>elCharge</h1>
        <button class="tooltip" onclick="app.login.showForm()" title="Logg inn, eller registrer ny bruker">Logg inn</button>
    </div>
    <div id="search">
        <button onclick="app.buttons.slideInMenu()" id="menu-toggle"></button>
        <input id="search-box" type="text"/>
        <button class="float-left nav-here tooltip" onclick="navigation.fromUserSearch()" title="Lag en rute til destinasjonen som er skrevet i søkefeltet. Dette krever lokasjonstillatelse.">Naviger hit</button>
        <button id="my-loc-btn" class ="tooltip" onclick="app.gps.centerOnUser(0)" title="Gå til din posisjon"></button>
        <button id="lock-to-my-pos-btn" class="lock-pos" onclick="app.buttons.lockMapToUser(this)" title="Lås kartet til din posisjon">Lock</button>
    </div>
</header>
<?php
include 'menu.php';
?>
