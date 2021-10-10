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

var count=0;
var count4=0;

var Image

/**
 * Init function taht call all method
 * @return { void }
 */

function init()
{
    if ( matriceJeu != [] ? matriceJeu = creerMatrice() : null);

    placeBombe();
    CreateTab();

    var SelectLvl = document.getElementById("Option");
    var labelBombes = document.getElementById("nbBombes");

    SelectLvl.onchange = function(){

        reset();
        tabCellClicked = [];
        tabCellAdjacente = [];

        if (SelectLvl.value == "Facile"){
            nbBombesjeu = 20;
            lignesMatrice = 10;
            tailleCell = 5;
        }
        else if(SelectLvl.value == "Moyen"){
            nbBombesjeu = 35;
            lignesMatrice = 15;
            tailleCell = 3.25;
        }
        else{
            nbBombesjeu = 45;
            lignesMatrice = 20;
            tailleCell = 2.4;
        }

        labelBombes.innerHTML = nbBombesjeu;
        matriceJeu = [];
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
            tuileDom.name = tuile.i.toString() + tuile.j.toString();
            tuile.dom = tuileDom;

            // if(tuile.isBombe)
            // {
            //     myContent = document.createTextNode("*");
            //     tuileDom.appendChild(myContent);
            // }

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

            var MaCell = foundCell(element.name);
            var labelBombes = document.getElementById("nbBombes");

            var couleur ="";

            if( MaCell.j % 2 == 0 ? couleur = " background-color : rgb(170,215,81)" : couleur = " background-color : rgb(162,209,73)" );

            if(nbBombesjeu>0)
            {
                if ( element.marque ? element.marque = false : element.marque = true );

                if ( element.marque )
                {
                    nbBombesjeu-- ; 
                    element.style = "background-image: url('images/drapeaux.png'); background-size: auto;background-repeat: no-repeat;background-position: center center;"+couleur;
                }
                else
                {
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
                }
            }
           
            labelBombes.innerHTML = nbBombesjeu;
            return false;
        }, false);

        element.onclick = function ()
        {
            count4++;

            Macell = foundCell(element.name);
            if(Macell.isBombe)
            {
                EndGame();
            }
            else{
                Macell.decouvert = true;
                matriceJeu[Macell.i][Macell.j] = Macell;

                if( Macell.i % 2 == 0 && Macell.j % 2 == 0 || Macell.i % 2 != 0 && Macell.j % 2 != 0 ? 
                    element.style.backgroundColor = "rgb(229,194,159)" : element.style.backgroundColor = "rgb(215,184,153)")

                //if( !Macell.isBombe ? element.style.backgroundColor = "yellow" : element.style.backgroundColor = "red")

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
                        myContent = document.createTextNode(nbBombes);
                        element.appendChild(myContent);
                    }
                    decouvre();
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
    this.i=i; // ligne dans la grille
    this.j=j; //colonne
    this.y=T; // position en Pixel ( T est la hauteur et la largeur de la tuile )
    this.x=T; // idem 
    this.marque=false; // marquer d'un drapeux ?
    this.decouvert=false; // déja découverte ?
    this.im=null; // l'image à afficcher dans le canvas
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
 * Return the cell in the matrix with the same name than the param
 * @param { String } name
 * @return { Tuile } || @return { bool }
 */

function foundCell(name)
{
    for( let i = 0; i < lignesMatrice; i++ )
    {
        for( let j = 0; j < lignesMatrice; j++ )
        {
            if( name == matriceJeu[i][j].id )
            {
                return matriceJeu[i][j];
            }
        }
    }
    return false;
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
                        count++;
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
    OverlayEnd();
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

//////////////////////////////////////////** */

function OverlayEnd()
{
    const button = document.getElementById('buttonEnd')
    const closeModalButtons = document.querySelectorAll('[data-close-button]')
    const overlay = document.getElementById('overlay')

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




