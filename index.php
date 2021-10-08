<?php
session_start();
?>

<!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Title</title>
            <link rel="stylesheet" href="styles\Demineur.css">
            <script src="demineur.js"></script>
            <div class="ContentTop" id="ContentTop">

                <select name="Option" id="Option">
                    <option value="Facile"  selected="" >Facile</option>
                    <option value="Moyen">Moyen</option>
                    <option value="Difficle">Difficle</option>
                </select>

                <div class="Flag" id="Flag">
                    <div id="ImageFlag"></div>
                    <label name="nbBombes" id="nbBombes">20</label>
                </div>
                <div id="ImageTimer">
                </div>
                <div id="Timer">
                    <span id="minute">00</span>:<span id="second">00</span>
                </div>
            </div>
        </head>
        <body onload="init()">
            <div id = "jeu">
            </div>    
        </body>
    </html>
