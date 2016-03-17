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
<nav >
    <ul>
        <li>
            <h2 class="menu-item">Filter</h2>
            <ul class="sub-item">
                <div class="float-left">
                    Kontakttype</br>
                    Effekt
                </div>
                <div class="float-left">
                    <select id="select_port" name="type">
                        <option value="99">Vis alle ladere</option>
                        <option value="0">Unspecified</option>
                        <option value="14">Schuko</option>
                        <option value="22">Danish (Section 107-2-D1)</option>
                        <option value="29">Tesla Connector Roadster</option>
                        <option value="30">CHAdeMO</option>
                        <option value="31">Type 1</option>
                        <option value="32">Type 2</option>
                        <!--<option value="60">Type1/Type2</option>-->
                        <option value="34">Blue industrial 3-pin</option>
                        <option value="35">Blue industrial 4-pin</option>
                        <option value="36">Red industrial 5-pin</option>
                        <option value="38">Marechal</option>
                        <option value="39">CCS/Combo</option>
                        <option value="40">Tesla Connector Model</option>
                    </select></br>
                    <!--<input type="checkbox" name="Schuko" value="14"/> Schuko lader</br>-->
                    <select id="select-port-effect" name="effect">
                        <option value="0">Vis alle ladereffekter</option>
                    </select>
                </div></br>
                <button onclick="generateMarkers()">Oppdater filter</button>
            </ul>
        </li>
        <li>
            <h2 class="menu-item">Kart overlegg</h2>
            <ul class="sub-item">
                <li>Trafikk overlegg <button id="traffic-button" onclick="trafficOverlay()"></button></li>
                <li>Vær overlegg <button id="weather-button" onclick="weatherOverlay()"></button></li>
                <li>Sky overlegg <button id="cloud-button" onclick="cloudOverlay()"></button></li>
            </ul>
        </li>
        <li>
            <h2 class="menu-item">Rute</h2>
            <ul class="sub-item">
                <li>
                    <div>
                        Start posisjon <input id="nav-start-pos" type="text"/>
                        </br>Mellom punkt 1 <input id="nav-wp-pos" type="text"/>
                        </br>Mål <input id="nav-end-pos" type="text"/>
                        </br>Eksempel rute <button onclick="navigate()">Bygg rute</button>
                    </div>
                </li>
                <div id="right-panel">
                    <p>Total Distance: <span id="total"></span></p>
                </div>
            </ul>
        </li>
    </ul>
</nav>