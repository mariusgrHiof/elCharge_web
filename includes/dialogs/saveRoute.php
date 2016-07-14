<?php

 ?>
 <div id="save-route" class="dialog">
   <div class="top-bar">
     <button class="float-right close-form">x</button>
   </div>
   <h2>Lagre ruten</h2>
   <form id="save-route-form" class="ui-widget" action="javascript:;" onsubmit="station.favorite.addRoute(this)">
     <input class="clear-both" type="text" name="route-name" placeholder="Rutenavn" required>
     <textarea class="clear-both" type="text" name="route-comment" placeholder="Kommentar" form="js-save-route-form" required></textarea>
     <label for="save-as">Lagre som:</label>
     <input id="save-as" class="route-search" type="text" name="save-as" placeholder="Ny rute">
     <input type="submit" value="Lagre" class="submit_button">
   </form>
 </div>
