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
            <div id = "End">
                <button id="buttonEnd" data-modal-target="#modal">Open Modal</button>
            </div>    
            <div class="modal" id="modal">

                <div class="modal-Content"> 
                    <div class="leaderboard">
                        <div class="head">
                        <div class='console-container'>
                            <span id='textEnd'></span>
                            <div class='console-underscore' id='console'>&#95;
                            </div>
                        </div>
                        </div>
                        <div class="body">
                            <ol id ='HighScore'>
                               
                            </ol>
                        </div>
                    </div>
                    <div class="modal-Bottom">
                        <button data-close-button class="close-button">Retry</button>
                    </div>
                </div>
            </div>
            <div id="overlay"></div>
        </body>
    </html>

