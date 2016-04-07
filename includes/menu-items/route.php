<h2 class="menu-item caret">↓ Rute</h2>
<ul class="sub-item">
    <p><em>For å legge inn ladestasjoner du ønsker å kjøre innom på veien, velg ladestasjonens markør og velg "legg til i rute".</em></p>
    <li>
        <div class="clear-both">
            <div class="route-options">
                <ul>
                    <li>
                        Tillat bomstasjoner
                        <div class="onoffswitch">
                            <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="route-option-tolls" checked>
                            <label class="onoffswitch-label" for="route-option-tolls"></label>
                        </div>
                    </li>
                    <li>
                        Tillat motorveier
                        <div class="onoffswitch">
                            <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="route-option-highways" checked>
                            <label class="onoffswitch-label" for="route-option-highways"></label>
                        </div>
                    </li>
                    <li>
                        Tilby rute alternativer
                        <div class="onoffswitch">
                            <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="route-option-alternative-routes" checked>
                            <label class="onoffswitch-label" for="route-option-alternative-routes"></label>
                        </div>
                    </li>
                </ul>


            </div>
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
        <div id="total"></div>
        <div id="right-panel" class="clear-both">
        </div>
    </li>
</ul>