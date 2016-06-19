<?php
/**
 * Created by PhpStorm.
 * User: jonas
 * Date: 03.03.16
 * Time: 08:05
 */

?>
<nav class="menu" style="left:-700px;">
  <ul id="menu-list">
    <li>
      <?php
      include 'includes/userwindow.php';
      ?>
    </li>
    <li>
      Velg bilmodell
      <select id="select-car" name="car-model">
        <option value="0">Vis alle ladere</option>
      </select>
    </li>
    <li class="border">
      <?php include 'menu-items/chargers-nearby.html' ?>
    </li>
    <li class="border">
      <?php include 'menu-items/favourites.html' ?>
    </li>
    <li class="border">
      <?php include 'menu-items/route.html' ?>
    </li>
    <li class="border">
      <?php include 'menu-items/filter.html' ?>
    </li>
    <li class="border">
      <?php include 'menu-items/about-us.html' ?>
    </li>
    <li class="border">
      <?php include 'menu-items/help.html' ?>
    </li>
  </ul>
</nav>
