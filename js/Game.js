//Class that handles the main 3
class Game {
    constructor(names) {
        this.board         = new Board();
        this.names         = names;
        this.squares       = this.board.squares;
        this.players       = this.initPlayers(this.names);

    }

    startGame() {
        this.board.renderSquares();
        this.players[0].displayCheckers();
        this.players[1].displayCheckers();
        this.handleTurns('first');
        //this.pieceSelect();
       
    }

    initPlayers(names) {

        // var player1 = new Player(names[0], 1, '#4c4c4c', this.getSquares(1));
        // var player2 = new Player(names[1], 2, '#DC143C', this.getSquares(2));
        var player1 = new Player("Justin", 1, '#4c4c4c', this.getSquares(1));
        var player2 = new Player('Kate', 2, '#DC143C', this.getSquares(2));
        let players = [player1, player2];
      
        return players;
    }

    //this function must be fixed to pass the correct square objects
    getSquares(playerId) {

        let squares = this.squares; 
        let playerSquares = [];     
        if(playerId === 1) {
            for(let i = 0; i < squares.length; i++) {
                for(let j = 5; j < squares[i].length; j++) {
                    if(squares[i][j].id == 'black-square')
                    {
                       
                        playerSquares.push(squares[i][j]);
                        
                    }
                }
            }
        }

        if(playerId === 2) {
            for(let i = 0; i < squares.length; i++) {
                for(let j = 2; j >= 0; j--) {
                    if(squares[i][j].id == 'black-square')
                    {
                        playerSquares.push(squares[i][j]);
                    }
                }
            }
        }
        return playerSquares;
    }

    //call this when the move is over and on game start
    handleTurns(first = null) {
        //end event listener on board?

        let players = this.players;

        if(first == "first") {

            this.moveListener(players[0]);
            players[0].active = true;
            players[1].active = false;
                 
        }   
        else if(players[0].active) {
            this.moveListener(players[1]);
            players[0].active = false;
            players[1].active = true;
        }
        else if( players[1].active) {
            //call listener, which calls movePieces() but only allow that players 
            this.moveListener(players[0]);
            players[0].active = true;
            players[1].active = false;
        }
        
    }

    moveListener(player) {
        //at end of this function call handle turns again
        //call get score function to determine whether or not to call handleTurns again

        //handle first click ie. piece selection
        //if player whos turn it is selects wrong piece, display error message


        //then allow the user to select a square
        //run check on selected square to see if it contains a piece owned by player
        //let board = this.board;
        let board = document.querySelector('.board');
        let self = this;
        
        board.addEventListener('click', function(event) {

            let targetList = event.target.classList;
            let isSelectableSquare = targetList.contains('selectable');



            if(targetList.contains('checker')) {

                // if(targetList.contains('clicked')) {
                //     self.removeClickedClass();
                //     self.removeSelectableClass();
                // }
              
                if(!targetList.contains('clicked')) {
                    let activeSquare = self.checkerSelect(player, event);
                    if(activeSquare ) {
                    
                        let square = activeSquare[0];
                        let checkerElement = activeSquare[1];
                        let moves = new Moves(player, square, self.squares);
                        self.moves = moves;
                        self.removeSelectableClass();

                        let possibleMoves = moves.possibleMoves(square);
                        
                        self.displayMoveOptions(possibleMoves);
                        
                    }
                }
                else {
                    self.removeClickedClass();
                    self.removeSelectableClass();
                }

            }

            //will be used to also call the method on the piece moevemtn method as well
            if(isSelectableSquare) {
            
                let player = self.getActivePlayer();
                
                //adds the selected checker to the square object checker property
                self.addCheckerToSquareObject(event.target, player);

                //removes the selected checker from the previous squares checker property
                self.removeCheckerFromSquareObject();
                self.removeSelectableClass();

                ////moves the checker html element to target square
                self.addPieceElement(event.target);

                //removed the '.clicked' class from the target checker
                self.removeClickedClass();

                //change the active player
                self.handleTurns();

            }
        });
    
        //this.handleTurns();

    }

    //behavior of selection
    // click a piece, add clicked class to 
    checkerSelect(player, event) {

        let target        = event.target;
        let ownPiece      = target.dataset.checker;
        let square        = target.parentElement;
        let board         = document.querySelector('.board');
        let pieceSelected = false;
        let myPieces      = document.querySelectorAll('.clicked');

        //determne if target is checker and if its the active players
        if(target.classList.contains('checker') && ownPiece[0] == player.id) {
            
            //if piece isn't already selected
            if(!target.classList.contains('clicked') && myPieces) {
                 
                target.classList.add('clicked');
                if(myPieces[0]) {
                    myPieces[0].classList.remove('clicked');
                    myPieces = [];
                   
                }
               
                pieceSelected = true;
            }
            //TODO NEed to create method to remove clicked 
            else if(target.classList.contains('clicked')) {
                target.classList.remove('clicked');
            }
           
            return [square, event.target];
        }

        return 0;
      
    }

    //this function is made to handle the way an
    //available square looks to the user
    //params - possibleMoves - Array of  Square objects
    displayMoveOptions(possibleMoves) {

        let squareElements = this.convertSquareToElement(possibleMoves);
        for(let i = 0; i < squareElements.length; i++ ) {
            squareElements[i].classList.add('selectable');
        }
    
    }

    //this function removes the selectable class on user move
    //params - possibleMoves - Array of  Square objects
    removeSelectableClass() {

        let squareElements = document.querySelectorAll('.selectable');

        if(squareElements) {
            for(let i=0; i < squareElements.length; i++ ){ 
                if(squareElements[i].classList.contains('selectable')) {
                    squareElements[i].classList.remove('selectable');
                }
            }
        }
      
    }

    ///this function converts a square object to and html element
    //params -possibleMoves - array of Square Objects
    //returns array of square elements
    convertSquareToElement(possibleMoves) {

        let squareElements = possibleMoves.map( square => {
            let id = square.x + ',' + square.y;
            let element = document.querySelector("[data-id='" + id + "']");

            return element;
        });
        
        return squareElements;
    }
    
    // function to turn element into square object
    // params(square - HTML Element)
    // return Square object
    convertSquareToObject(square) {

        let id = square.dataset.id;
        let x  = parseInt(id[0]);
        let y  = parseInt(id[2]);
        let squareList= this.squares;
        let squareObject = squareList[x][y];

        return squareObject;

    }

    // function to turn element into checker object
    // params(checker - HTML Element)
    // return checker object  
    convertCheckerToObject(checker, player) {

        let id = checker.dataset.checker;
        let  y = parseInt(id[2]);
        let checkers = player.checkersLeft;
        let checkerObject = checkers[y];

        return checkerObject;
    }

    //This method is used to add the element to the square that is selected
    //Params(selectableSquare - html element);
    //Returns - N/A
    addPieceElement(selectableSquare) {

        let activeChecker = document.querySelector('.clicked');
        selectableSquare.append(activeChecker);

    }

     //This method is used to get the active player
    //Params - none;
    //Returns - N/A
    getActivePlayer() {

        let activePlayer = this.players.filter( player => {
            return player.active;
        });
    
        return activePlayer[0];

    }

    //This method is used to remove the checker element from the dom
    //Params - none;
    //Returns - N/A
    removePieceElement() {

        let activeChecker = document.querySelector('.clicked');
        activeChecker.parentNode.removeChild(activeChecker);

    }

    //This method removes the checker from the square Object
    //Params -none
    //Returns - N/A
    removeCheckerFromSquareObject() {

        let activeChecker = document.querySelector('.clicked');
        let parentSquare = activeChecker.parentNode;
        let squareObject = this.convertSquareToObject(parentSquare);
        squareObject.checker = null;

    }

    //This method adds the checker to the square Object
    //Params -(targetSquare - HTML Element)
    //Returns - N/A
    addCheckerToSquareObject(targetSquare) {

        let activeChecker = document.querySelector('.clicked');
        let checkerObject = this.convertCheckerToObject(activeChecker, this.getActivePlayer());
        
        let squareObject = this.convertSquareToObject(targetSquare);

        squareObject.checker = checkerObject;
        
    }

    //This method is used to remove the '.clicked' class from the active checker
    //Params - none;
    //Returns - N/A
    removeClickedClass(){

        let activeChecker = document.querySelector('.clicked');
        activeChecker.classList.remove('clicked');

    }


}