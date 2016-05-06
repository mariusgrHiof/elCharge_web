<?php
/**
 * Created by PhpStorm.
 * User: jonas
 * Date: 03.03.16
 * Time: 08:05
 */

/*
0	Unspecified
14	Schuko
22	Danish (Section 107-2-D1)
29	Tesla Connector Roadster
30	CHAdeMO
31	Type 1
32	Type 2
60	Type1/Type2
34	Blue industrial 3-pin
35	Blue industrial 4-pin
36	Red industrial 5-pin
38	Marechal
39	CCS/Combo
40	Tesla Connector Model
41	Combo + CHAdeMO
42	CHAdeMO + Type 2
43	CHAdeMO + Combo + AC-Type2
50	Type 2 + Schuko
51	Type 2 + Danish (Section 107-2-D1)
 */
?>
<nav class="menu">
    <?php
    include 'includes/login.php';
    include 'includes/userwindow.php';
    ?>
    <ul id="menu-list">
        <li>
            Utfør bakgrundsoppdatering hvert
            <input id="bg-update-timer" type="number" value="5"/> min(0 er aldrig). <br />
            Velg bilmodell
            <select id="select-car" name="car-model">
                <option value="0">Vis alle ladere</option>
            </select></br>
            <form id="selected-charger-capacity" action="">
                <input type="radio" name="kW" value="0" checked> Alle kapasiteter<br>
                <input type="radio" name="kW" value="12"> Semihurtig og hurtig<br>
                <input type="radio" name="kW" value="43"> Hurtigladere
            </form>
        </li>
        <li class="border">
            <?php include 'menu-items/chargers-nearby.html' ?>
        </li>
        <li class="border">
            <?php include 'menu-items/favourites.html' ?>
        </li>
        <li class="border">
            <?php include 'menu-items/route.html' ?>
        </li><!--
        <li class="border">
            <?php //include 'menu-items/filter.html' ?>
        </li>-->
        <li class="border">
            <?php include 'menu-items/overlay.html' ?>
        </li>
        <li class="border">
            <?php include 'menu-items/about-us.html' ?>
        </li>
        <li class="border">
            <?php include 'menu-items/help.html' ?>
        </li>
    </ul>
</nav>