<h2 class="menu-item caret">↓ Rute</h2>
<ul class="sub-item">
    <p><em>For å legge inn ladestasjoner du ønsker å kjøre innom på veien, velg ladestasjonens markør og velg "legg til i rute".</em></p>
    <li>
        <div class="clear-both">
            <div class="float-left cover-third">
                Start posisjon</br>
            </div>
            <div class="float-left cover-twothird">
                <input id="nav-start-pos" type="text"/>
            </div>
        </div>
        <div class="clear-both">
            <div class="float-left cover-third">
                Waypoints:
            </div>
            <div class="float-left cover-twothird">
                <span id="waypoint-list"></span>
            </div>
        </div>
        <div class="clear-both">
            <div class="float-left cover-third">
                Mål
            </div>
            <div class="float-left cover-twothird">
                <input id="nav-end-pos" type="text"/>
            </div>
        </div>
        <button class="clear-both" onclick="navigate()">Bygg rute</button>
        <div id="right-panel" class="clear-both">
        </div>
    </li>
</ul>