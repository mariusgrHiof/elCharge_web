<?php

 ?>
 <div id="save-route" class="dialog">
   <div class="top-bar">
     <button class="float-right close-form">x</button>
   </div>
   <h2>Lagre ruten</h2>
   <form id="route-form" action="javascript:;" onsubmit="station.favorite.addRoute(this)">
     <input class="clear-both" type="text" name="name" placeholder="Rutenavn" required>
     <input class="clear-both" type="text" name="comment" placeholder="Kommentar" required>
     <p>Lagre som: <input class="clear-both route-search" type="text" name="save-as" placeholder="Ny rute"></p>
     <input type="submit" value="Lagre" class="submit_button">
   </form>
 </div>
