var lignesMatrice = 10;
var matriceJeu = [];
var nbBombesjeu = 20;
var tabCellAdjacente = [];
var tabCellClicked = [];
var tailleCell = 5;
var Begin  = false;

var cron;
var minute = 0;
var second = 0;
var millisecond = 0;
var firstShot = true;

var CellToDiscover;

/**
 * Init function taht call all method
 * @return { void }
 */

function init()
{
    firstShot = true;
    var SelectLvl = document.getElementById("Option");
    var labelBombes = document.getElementById("nbBombes");

    if( sessionStorage.getItem('clé') != null)
    {
        nbBombesjeu = sessionStorage.getItem('clé');
        labelBombes.innerHTML = nbBombesjeu;
        SelectLvl.selectedIndex = (nbBombesjeu == 20 ? 0 : nbBombesjeu == 35 ? 1 : nbBombesjeu == 45 ? 2 : 0);
        setGameParameters(SelectLvl.selectedIndex);
    }
    else
    {
        sessionStorage.setItem('clé',nbBombesjeu);
    }

    if ( matriceJeu != [] ? matriceJeu = creerMatrice() : null);

    placeBombe();
    CreateTab();

    SelectLvl.onchange = function(){
        reset();
        tabCellClicked = [];
        tabCellAdjacente = [];
        matriceJeu = [];

        setGameParameters(SelectLvl.selectedIndex);
        sessionStorage.setItem('clé',nbBombesjeu);

        init();
    };

    if(!Begin)
    {
        start();
        Begin=true;
    }
}

/**
 * Main function that manage UI and recusivity for the cases
 * @return { void }
 */

function CreateTab()
{
    let parent = document.getElementById("jeu");

    try{
        let child = document.getElementById("table");
        parent.removeChild(child);
    }catch{}

    let myTable = document.createElement("table");
    myTable.id = "table"

    for (let i = 0 ; i< lignesMatrice ; i++ )
    {
        let myRow = document.createElement("tr");
        myTable.appendChild(myRow);

        for ( let j = 0 ; j < lignesMatrice ; j++ )
        {
            var tuile = matriceJeu[i][j];

            tuileDom =  document.createElement("td");
            tuileDom.style.width = tuile.x + "vw";
            tuileDom.style.height = tuile.y + "vh";
            tuileDom.id = "Cell";
            tuileDom.name = tuile.i.toString() + "-" + tuile.j.toString();

            tuile.dom = tuileDom;

            if( j % 2 == 0 ? tuileDom.style.backgroundColor = "rgb(170,215,81)" : tuileDom.style.backgroundColor = "rgb(162,209,73)" )

            myRow.appendChild(tuile.dom);
        }
    }

    parent.appendChild(myTable);
    Macellule = document.querySelectorAll('td#Cell');
    var Macell;

    Macellule.forEach(element => {

        element.addEventListener('contextmenu', function(ev) {
            ev.preventDefault();

            var coordonate = element.name.split('-');
            var MaCell = matriceJeu[coordonate[0]][coordonate[1]];

            var labelBombes = document.getElementById("nbBombes");

            var couleur ="";

            if( MaCell.j % 2 == 0 ? couleur = " background-color : rgb(170,215,81)" : couleur = " background-color : rgb(162,209,73)" );

            if(!MaCell.decouvert)
            {
                if(nbBombesjeu > 0)
                {
                    if ( element.marque ? element.marque = false : element.marque = true );
    
                    if ( element.marque )
                    {
                        MaCell.marque = true;
                        nbBombesjeu-- ; 
                        element.style = "background-image: url('images/drapeaux.png'); background-size: auto;background-repeat: no-repeat;background-position: center center;"+couleur;
                    }
                    else
                    {
                        MaCell.marque = false;
                        nbBombesjeu++;
                        element.style = couleur;
                    }
                }
                else{
                    if (element.marque)
                    {
                        nbBombesjeu++;
                        element.style = couleur;
                        element.marque = false;
                        MaCell.marque = false;
                    }
                }
               
                labelBombes.innerHTML = nbBombesjeu;
                return false;
            }
        }, false);

        element.onclick = function ()
        {
            var coordonate = element.name.split('-');
            var Macell = matriceJeu[ coordonate[0] ][ coordonate[1] ];

            if(Macell.isBombe)
            {
                if(firstShot ? antiLoose(Macell) : EndGame());
                Macell.dom.click();
            }
            else{

                firstShot = false;
                if( Macell.j % 2 == 0 ? couleur = " background-color : rgb(170,215,81)" : couleur = " background-color : rgb(162,209,73)" );
                if(Macell.marque)
                {
                    var labelBombes = document.getElementById("nbBombes");
                    nbBombesjeu++;
                    element.style = couleur;
                    element.marque = false;
                    Macell.marque = false;
                    labelBombes.innerHTML = nbBombesjeu;
                }

                Macell.decouvert = true;
                matriceJeu[Macell.i][Macell.j] = Macell;

                if( Macell.i % 2 == 0 && Macell.j % 2 == 0 || Macell.i % 2 != 0 && Macell.j % 2 != 0 ? 
                    element.style.backgroundColor = "rgb(229,194,159)" : element.style.backgroundColor = "rgb(215,184,153)")

                var nbBombes = countBombesAround(Macell.i,Macell.j);

                if( nbBombes == 0 )
                {  
                    try{
                        if( !matriceJeu[Macell.i-1][Macell.j-1].decouvert )
                        {
                            if( FoundInArray( tabCellAdjacente, matriceJeu[Macell.i-1][Macell.j-1] ) )
                            {
                                withdrawElement( tabCellAdjacente , matriceJeu[Macell.i-1][Macell.j-1]);
                            }
                            tabCellAdjacente.push( matriceJeu[Macell.i-1][Macell.j-1] );
                        }
                    }catch{}
                    try{
                        if(!matriceJeu[Macell.i+1][Macell.j+1].decouvert)
                        {
                            if(FoundInArray( tabCellAdjacente, matriceJeu[Macell.i+1][Macell.j+1]))
                            {
                                withdrawElement( tabCellAdjacente , matriceJeu[Macell.i+1][Macell.j+1] );
                            }
                            tabCellAdjacente.push( matriceJeu[Macell.i+1][Macell.j+1] );
                        }
                    }catch{}
                    try{
                        if(!matriceJeu[Macell.i-1][Macell.j+1].decouvert)
                        {
                            if(FoundInArray ( tabCellAdjacente, [Macell.i-1][Macell.j+1]))
                            {
                                withdrawElement( tabCellAdjacente , matriceJeu[Macell.i-1][Macell.j+1]);
                            }
                            tabCellAdjacente.push( matriceJeu[Macell.i-1][Macell.j+1] );
                        }
                    }catch{}
                    try{
                        if(!matriceJeu[Macell.i+1][Macell.j-1].decouvert)
                        {
                            if(FoundInArray( tabCellAdjacente, matriceJeu[Macell.i+1][Macell.j-1]))
                            {
                                withdrawElement( tabCellAdjacente , matriceJeu[Macell.i+1][Macell.j-1]);
                            }
                            tabCellAdjacente.push( matriceJeu[Macell.i+1][Macell.j-1] );
                        }
                    }catch{}
                    try{
                        if(!matriceJeu[Macell.i-1][Macell.j].decouvert)
                        {
                            if(FoundInArray( tabCellAdjacente, matriceJeu[Macell.i-1][Macell.j]))
                            {
                                withdrawElement( tabCellAdjacente , matriceJeu[Macell.i-1][Macell.j]);
                            }
                            tabCellAdjacente.push( matriceJeu[Macell.i-1][Macell.j] );
                        }
                    }catch{}
                    try{
                        if(!matriceJeu[Macell.i+1][Macell.j].decouvert)
                        {
                            if(FoundInArray( tabCellAdjacente, matriceJeu[Macell.i+1][Macell.j]))
                            {
                                withdrawElement( tabCellAdjacente , matriceJeu[Macell.i+1][Macell.j]);
                            }
                            tabCellAdjacente.push( matriceJeu[Macell.i+1][Macell.j] );
                        }
                    }catch{}
                    try{
                        if(!matriceJeu[Macell.i][Macell.j-1].decouvert)
                        {
                            if(FoundInArray( tabCellAdjacente, matriceJeu[Macell.i][Macell.j-1]))
                            {
                                withdrawElement( tabCellAdjacente , matriceJeu[Macell.i][Macell.j-1]);
                            }
                            tabCellAdjacente.push( matriceJeu[Macell.i][Macell.j-1] );
                        }
                    }
                    catch{}
                    try{
                        if(!matriceJeu[Macell.i][Macell.j+1].decouvert)
                        {
                            if(FoundInArray( tabCellAdjacente, matriceJeu[Macell.i][Macell.j+1]))
                            {
                                withdrawElement( tabCellAdjacente , matriceJeu[Macell.i][Macell.j+1]);
                            }
                            tabCellAdjacente.push( matriceJeu[Macell.i][Macell.j+1]) ;
                        }
                    }catch{}

                    decouvre();            
                }
                else
                {
                    if(element.firstChild == null)
                    {
                        let couleurTexte = ColorTextBombs(nbBombes);
                        myContent = document.createTextNode(nbBombes);
                        element.style.color = couleurTexte;
                        element.style.fontWeight = 'bold';
                        element.style.fontSize = "1.3vw";
                        element.appendChild(myContent);
                    }
                    decouvre();
                }

                if(CellToDiscover == 0)
                {
                    pause();
                    OverlayEnd("You Win");
                }
            }
        }
    });
}

/**
 * Class object Tuile
 * @param { int } id
 * @param { int } i
 * @param { int } j
 */

function tuile(id,i,j)
{
    let T = tailleCell;
    this.id = id;
    this.i=i; 
    this.j=j; 
    this.y=T; 
    this.x=T; 
    this.marque=false; 
    this.decouvert=false; 
    this.im=null; 
    this.isBombe=false;
    this.dom = null;
}
   
/**
 * Create and initiate the matrix with Tuiles in all cases
 * The size of the matrix is set when the difficulty changes
 * @return { [[]] }
 */

function creerMatrice() 
{
    var ligne;
    var matrice = [];
    for ( let li = 0; li < lignesMatrice; li += 1 ) 
    {
        ligne = [];
        for ( let co = 0; co < lignesMatrice; co += 1 ) 
        {
            ligne.push( new tuile( li.toString() + co.toString() , li , co ) );
        }
        matrice.push(ligne);
    }
    return matrice;
}

/**
 * Place the bombs in the matrix the number of bombs is set 
 * when the difficulty changes
 * @return { void }
 */

function placeBombe()
{
    let count = 0;
    while( count < nbBombesjeu )
    {
        let x = Math.floor( ( Math.random() * lignesMatrice - 1 ) + 1 );
        let y = Math.floor( ( Math.random() * lignesMatrice - 1 ) + 1 );
        if( !matriceJeu[x][y].isBombe )
        {
            matriceJeu[x][y].isBombe = true;
            count++;
        }
    }
}

/**
 * Return the number of bombs around the cell in position i,j
 * @param { int } i
 * @param { int } j
 * @return { int }
 */

function countBombesAround(i,j)
{
    let count = 0;
    try{
        count += matriceJeu[i-1][j-1].isBombe ? 1 : 0;
    }catch{}
    try{
        count += matriceJeu[i-1][j].isBombe ? 1 : 0;
    }catch{}
    try{
        count += matriceJeu[i-1][j+1].isBombe ? 1 : 0;
    }catch{}
    try{
        count += matriceJeu[i][j-1].isBombe ? 1 : 0;
    }catch{}
    try{
        count += matriceJeu[i][j+1].isBombe ? 1 : 0;
    }catch{}
    try{
        count += matriceJeu[i+1][j-1].isBombe ? 1 : 0;
    }catch{}
    try{
        count += matriceJeu[i+1][j].isBombe ? 1 : 0;
    }catch{}
    try{
        count += matriceJeu[i+1][j+1].isBombe ? 1 : 0;
    }catch{}

    return count;
}

/**
 * Return true of false in the element in param is in the tab in param
 * @param { [] } array
 * @param { Object } object
 * @return { bool }
 */

function FoundInArray(array,object)
{
    for( let i = 0; i < array.length; i++ ) {
        if( object === array[i] ) {
            return true;
        }
    }
    return false;
}

/**
 * Browse the tabCellAdjacente and cick on every item which is Tuile
 * Only if the element is not already discovered
 * @return { void }
 */

function decouvre()
{
    CellToDiscover --;
    for( let i = tabCellAdjacente.length-1; i >-1; i-- )
    {
        try{
            if( !tabCellAdjacente[i].decouvert )
            {
                if( tabCellAdjacente.length !=0 )
                {
                    if( !FoundInArray( tabCellClicked, tabCellAdjacente[i].id) )
                    {
                        UneCell = tabCellAdjacente[i];
                        tabCellAdjacente = tabCellAdjacente.filter(function(elementWithdraw) {
                            return  elementWithdraw !== tabCellAdjacente[i];
                        })
                        tabCellClicked.push(UneCell.id);
                        UneCell.dom.click(); 
                    }
                }
            }
        }catch{}
    }
}

/**
 * Withdraw the element in param from the tab in param
 * @param { [] } tab
 * @param { Object } elementToWithdraw
 * @return { void }
 */

function withdrawElement(tab,elementToWithdraw)
{
    tab = tab.filter(function(CurrentElement) {
        return  CurrentElement !== elementToWithdraw;
    })
}

function EndGame()
{
    pause();
    var delayInMilliseconds = 1000; //1 second

    for( let i = 0; i < lignesMatrice; i++ )
    {
        for( let j = 0; j < lignesMatrice; j++ )
        {
            if( matriceJeu[i][j].isBombe )
            {
                if(j % 2 == 0 ? couleur = " background-color : rgb(170,215,81)" : couleur = " background-color : rgb(162,209,73)" );
                
                matriceJeu[i][j].dom.style = "background-image: url('images/bombe.png'); background-size: auto;background-repeat: no-repeat;background-position: center center;"+couleur;
                
            }
        }
    }
    OverlayEnd("You Loose");
}

function ColorTextBombs(number)
{
    let color;

    if(number == 1 ?  color = "blue" : null );
    if(number == 2 ?  color = "green" : null );
    if(number == 3 ?  color = "red" : null );
    if(number == 4 ?  color = "purple" : null );
    if(number == 5 ?  color = "orange" : null );
    if(number == 6 ?  color = "gold" : null );

    return color;
}

function setGameParameters(selectedIndex)
{
    if (selectedIndex == 0){
        nbBombesjeu = 20;
        lignesMatrice = 10;
        tailleCell = 5;
        CellToDiscover = 80;
    }
    else if(selectedIndex == 1){
        nbBombesjeu = 35;
        lignesMatrice = 15;
        tailleCell = 3.25;
        CellToDiscover = 190;
    }
    else{
        nbBombesjeu = 45;
        lignesMatrice = 20;
        tailleCell = 2.4;
        CellToDiscover = 355;
    }
}

function antiLoose(aCell)
{
    var success = false;
    while(!success)
    {
        let x = Math.floor( ( Math.random() * lignesMatrice - 1 ) + 1 );
        let y = Math.floor( ( Math.random() * lignesMatrice - 1 ) + 1 );
        if( !matriceJeu[x][y].isBombe && ( x != aCell.i || y != aCell.j ) )
        {
            matriceJeu[x][y].isBombe = true;
            matriceJeu[aCell.i][aCell.j].isBombe = false;
            success = true;
        }
    }
}


/**
 * PART FOR THE TIMER
 */

function timer()
{
    if ( ( millisecond += 10 ) == 1000 )
    {
        millisecond = 0;
        second++;
    }
    if ( second == 60 )
    {
        second = 0;
        minute++;
    }
    if ( minute == 60 ) 
    {
        minute = 0;
    }
    document.getElementById('minute').innerText = returnData(minute);
    document.getElementById('second').innerText = returnData(second);
}
     
function returnData(input) {
    return input > 10 ? input : `0${input}`
}

function start() 
{
    pause();
    cron = setInterval(() => { timer(); }, 10);
}

function pause() {
    clearInterval(cron);
}

function reset() {
    minute = 0;
    second = 0;
    millisecond = 0;
    document.getElementById('minute').innerText = '00';
    document.getElementById('second').innerText = '00';
}

/**
 * PART FOR THE End game Overlay
 */

function OverlayEnd(text)
{
    const button = document.getElementById('buttonEnd')
    const closeModalButtons = document.querySelectorAll('[data-close-button]')
    const overlay = document.getElementById('overlay')
    consoleText([text], 'textEnd',(text == "You Loose" ? ['Red'] : ['blue'] ) );

    button.addEventListener('click', () => {
        const modal = document.querySelector(button.dataset.modalTarget)
        openModal(modal)
    })

    button.click();

    overlay.addEventListener('click', () => {
        const modals = document.querySelectorAll('.modal.active')
        modals.forEach(modal => {
        closeModal(modal)
        })
    })

    closeModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal')
            closeModal(modal)
        })
    })

    function openModal(modal) {
        if (modal == null) return
        modal.classList.add('active')
        overlay.classList.add('active')
    }

    function closeModal(modal) {
        if (modal == null) return
            modal.classList.remove('active')
            overlay.classList.remove('active')
            reset()
            init();
        }
}


function consoleText(words, id, colors) {
    if (colors === undefined) colors = ['#fff'];
    var visible = true;
    var con = document.getElementById('console');
    var letterCount = 1;
    var x = 1;
    var waiting = false;
    var target = document.getElementById(id);
    target.setAttribute('style', 'color:' + colors[0])
    window.setInterval(function() {
  
      if (letterCount === 0 && waiting === false) {
        waiting = true;
        target.innerHTML = words[0].substring(0, letterCount)
        window.setTimeout(function() {
          var usedColor = colors.shift();
          colors.push(usedColor);
          var usedWord = words.shift();
          words.push(usedWord);
          x = 1;
          target.setAttribute('style', 'color:' + colors[0])
          letterCount += x;
          waiting = false;
        }, 1000)
      } else if (letterCount === words[0].length + 1 && waiting === false) {
        waiting = true;
        window.setTimeout(function() {
          x = -1;
          letterCount += x;
          waiting = false;
        }, 1000)
      } else if (waiting === false) {
        target.innerHTML = words[0].substring(0, letterCount)
        letterCount += x;
      }
    }, 120)
    window.setInterval(function() {
      if (visible === true) {
        con.className = 'console-underscore hidden'
        visible = false;
  
      } else {
        con.className = 'console-underscore'
  
        visible = true;
      }
    }, 400)
}