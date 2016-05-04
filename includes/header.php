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
        <button onclick="dropdown(this, true)" id="menu-toggle"></button>
        <input id="search-box" type="text"/>
    </div>
    <button id="my-loc-btn" onclick="centerOnUser()"><img src="icons/my_pos_marker.svg" style="width:1.5em; height:1.5em;"/></button>
    <?php
    include 'menu.php';
    //include 'includes/footer.php';
    ?>
</header>

