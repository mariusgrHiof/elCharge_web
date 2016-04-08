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

        <h1>elCharge</h1>
    </div>
    <div id="search">
        <button onclick="dropdown(this, true)" id="menu-toggle"></button>
        <input id="search-box" type="text"/>
        <button>Søk</button>

    </div>
    <?php
    include 'menu.php';
    include 'includes/footer.php';
    ?>

</header>
