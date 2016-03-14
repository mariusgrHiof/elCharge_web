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
        <li>Meny element</li>
        <li><button class="show_login"> Logg inn </button> </li>
    </ul>
    <form action>
        <select id="select_port" name="type">
            <option value="0">Unspecified</option>
            <option value="14">Schuko</option>
            <option value="22">Danish (Section 107-2-D1)</option>
            <option value="29">Tesla Connector Roadster</option>
            <option value="30">CHAdeMO</option>
            <option value="31">Type 1</option>
            <option value="32">Type 2</option>
            <option value="60">Type1/Type2</option>
            <option value="34">Blue industrial 3-pin</option>
            <option value="35">Blue industrial 4-pin</option>
            <option value="36">Red industrial 5-pin</option>
            <option value="38">Marechal</option>
            <option value="39">CCS/Combo</option>
            <option value="40">Tesla Connector Model</option>
            <option value="41">Combo + CHAdeMO</option>
            <option value="42">CHAdeMO + Type 2</option>
            <option value="43">CHAdeMO + Combo + AC-Type2</option>
            <option value="50">Type 2 + Schuko</option>
            <option value="52">Type 2 + Danish (Section 107-2-D1)</option>
        </select>
        <button type="submit">Sett filter</button>
    </form>


    <div id="login_popup">
        <a href="#" class="show_login">Logg inn </a>
        <a href="#" class="show_register">Registrer</a>
        <form action="registration_login/login.php" method="post">
            <input type="text" name="username" placeholder="Brukernavn">
            <br>
            <input type="password" name="password" placeholder="Passord">
            <br>
            <br>
            <input type="submit" value="Logg inn" class="submit_button">
            <a href="#" class="close_form">Lukk </a>

        </form>
    </div>

    <div id="register_popup">
        <a href="#" class="show_login">Logg inn </a>
        <a href="#" class="show_register">Registrer</a>
        <form action="registration_login/register.php" method="post">
            <input type="text" name="username" placeholder="Brukernavn">
            <br>
            <input type="password" name="password" placeholder="Passord">
            <br>
            <br>
            <input type="submit" value="Registrer" class="submit_button">
            <a href="#" class="close_form">Lukk </a>

        </form>
    </div>
</nav>