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
        this.statsContainerName();
        this.moveListener();
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

        if(this.possibleMoves) {
            this.possibleMoves = undefined;
        }

        let players = this.players;

        if(first == "first") {

            //this.moveListener(players[0]);
            players[0].active = true;
            players[1].active = false;
                 
        }   
        else if(players[0].active) {
            //this.moveListener(players[1]);
            players[0].active = false;
            players[1].active = true;
        }
        else if( players[1].active) {
            //call listener, which calls movePieces() but only allow that players 
           // this.moveListener(players[0]);
            players[0].active = true;
            players[1].active = false;
        }
        
    }

    //Function that calls the main listener on the board
    //Interfaces with most other functions, needs to be refactored
    //Params - N/A
    //Returns -N/A
    moveListener() {

        let board = document.querySelector('.board');
        let self = this;
        
        board.addEventListener('click', function(event) {

            let targetList = event.target.classList;
            if(targetList.contains('checker')) {
                var targetPlayer = event.target.dataset.checker[0];
            }
            let player = self.getActivePlayer();
            let isSelectableSquare = targetList.contains('selectable');

            if(targetList.contains('checker') && targetPlayer == player.id ) {
              
                if(!targetList.contains('clicked')) {
                    // gets the square element
                   
                    let activeSquare = self.checkerSelect(player, event);
                    if(activeSquare ) {
                    
                        //clicked square
                        let square = activeSquare[0];
                        //clicked checker
                        let checkerElement = activeSquare[1];
                       
                        let moves = new Moves(player, square, self.squares);
                        self.moves = moves;
                        self.removeSelectableClass();

                        let possibleMoves = moves.possibleMoves(square);
                        console.log(possibleMoves.moves);

                        //TODO This needs to be re-written, it returns error when there isn't a move ava
                        if(!possibleMoves.moves[0]) {
                            self.determineNoMoves(player,square);
                        }
                        else {
                            self.displayMoveOptions(possibleMoves.moves);
                        }

                        self.possibleMoves = possibleMoves.moves;
                        self.jumpMoves = null;
                        self.jumpMoves = possibleMoves.jumps;
                        
                    }
                }
                else {
                    self.removeClickedClass();
                    self.removeSelectableClass();
                }

            }

            //will be used to also call the method on the piece moevemtn method as well
            if(isSelectableSquare) {
            
                let isJumpSquare = self.isjumpMove(event.target);
                let player       = self.getActivePlayer();
                let isReady      = false;

                
                //adds the selected checker to the square object checker property
                self.addCheckerToSquareObject(event.target, player);

                //removes the selected checker from the previous squares checker property
                self.removeCheckerFromSquareObject();
                self.removeSelectableClass();

                ////moves the checker html element to target square
                self.addPieceElement(event.target);

                //removed the '.clicked' class from the target checker
                self.removeClickedClass();

                //if the selectedSquare is a jumppMove call related methods
                if(isJumpSquare) {
                   //removes 
    
                   let jumpSquare =  self.captureCheckerfromSquareObject(event.target);
                    //Removes the jumped element from DOM
                    if(jumpSquare) {
                        
                        isReady = self.removeCapturedChecker(jumpSquare);
                        
                    }
                    else {
                        
                        self.handleTurns();
                    }
                }
                else {
                    // if the player doesn't jump a piece, switch turns
                    self.handleTurns();

                }
            
            }

        });

        let winner = this.determineWinner();

        if(winner) {
            this.outputWinner();
        }
        else {
            self.handleTurns();
        }

    }

    //behavior of selection
    // click a piece, add clicked class to
    //Returns - Square Element, clicked checker element
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

        if(possibleMoves.constructor === Array) {
            let squareElements = possibleMoves.map( square => {
                let id = square.x + ',' + square.y;
                let element = document.querySelector("[data-id='" + id + "']");

                return element;
            });
            return squareElements;
        }
        else {
            let id = possibleMoves.x + ',' + possibleMoves.y;
            let element = document.querySelector("[data-id='" + id + "']");

            return element;

        }

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
        if(id.length === 3) {
            var  y = parseInt(id[2]);
        }
        else { 
            var y = parseInt(id[2] + id[3]);
        }
        let checkers = player.checkersLeft;

        for(let i =0; i < checkers.length; i++) {
            if(checkers[i].index == y ){
                let checkerObject = checkers[i];
                return checkerObject;
            }
        }


       
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

        if(squareObject.y === 0 || squareObject.y === 7) {
            checkerObject.kingChecker();
        }
        
    }

    //This method is used to remove the '.clicked' class from the active checker
    //Params - none;
    //Returns - N/A
    removeClickedClass() {

        let activeChecker = document.querySelector('.clicked');
        activeChecker.classList.remove('clicked');

    }

    //this method will determine if the square selected is a jump square
    //Params - selectedSquare - HTML Element
    //Returns Boolean
    isjumpMove(selectedSquare) {
        
        let jumpMoves = this.jumpMoves.filter(move => {
            return move;
        });



        if(!jumpMoves || jumpMoves.length === 0) {
            return;
        }
        else{
            return true;
        }
    
    }

    //this method will determine remove the jumped square from the DOM
    //Params - square - HTML Element
    //Returns - removes element from DOM
    captureCheckerfromSquareObject(square) {

        let squareObject = this.convertSquareToObject(square);
        let squares = this.squares;    
    
        if(this.possibleMoves.length === 1) {
            this.possibleMoves = this.possibleMoves.filter(move => {
                return move;
            });

            this.jumpMoves = this.jumpMoves.filter(move => {
                return move;
            });
        }
        
        for(let i = 0; i < this.possibleMoves.length; i++) {   

            if(this.possibleMoves[i] === squareObject) {
                let target = this.jumpMoves[i];

                if(this.jumpMoves[i]) {
                    let activePlayer = this.getActivePlayer();
                    
                    this.addTakenProptoChecker(this.jumpMoves[i].checker);
                    this.updateStatsCount(this.jumpMoves[i].checker.owner);
                    
                    this.jumpMoves[i].checker = null;
                    return this.jumpMoves[i];
                }
            }
        }
       
    }

    //function that adds the taken property to the checker that is jumped
    //Params - checker - checker Object
    //Returns - N/A
    addTakenProptoChecker(checker) {
        checker.taken = true;
    }



    //Function to removes the captured enemy piece
    //Params - square -HTML ELlement
    //Returns N/a
    removeCapturedChecker(square) {

        square = this.convertSquareToElement(square);
        let checker = square.querySelector('.checker');
        var isReady = true;
        this.jumpMoves = undefined;

        checker.remove();

        return isReady;
    }

    //Function to update the players stats in the DOM
    //Params - Player object
    //Returns N/A
    updateStatsCount(player) {
        
        let id = player.id;
        let playerStats = document.querySelector('[data-id="' + id + '"]');
        playerStats.innerHTML = player.checkersLeft.length;
    }

    //Function to populate the players name in the headline
    //Params - N/A
    statsContainerName() {
        let playerOneName = this.players[0].name;
        let playerTwoName = this.players[1].name;
        let playerOneHeadline = document.querySelector('.player-one_name');
        let playerTwoHeadline = document.querySelector('.player-two_name');

        playerOneHeadline.innerHTML = playerOneName;
        playerTwoHeadline.innerHTML = playerTwoName;
    }

    //Function to determine a winner
    //Params - N/A
    //Returns - N/A
    determineWinner(noMoves) {
        let players = this.players;
        let playerOneCheckers = players[0].checkersLeft.length;
        let playerTwoCheckers = players[1].checkersLeft.length;
        var winner = [];

        if(!noMoves) {
             winner.push(players.filter(player => {
                return player.checkersLeft.length === 0;
            }));
        }
        else {
            let max = Math.max(playerOneCheckers, playerTwoCheckers);

            if(max === playerOneCheckers) {
                winner.push(players[0]);
            }
            else {
                winner.push(players[1]);
            }

        }

        if(winner.length !== 0) {
            console.log(winner);
            console.log("The winner is " + winner[0].name) ;
            //call game ending method
        }
        else {

            return winner[0];
        }
        
    }

    //Params - ActivePlayer - object, targetSquare - htmlElement
    //Returns - 
    determineNoMoves(player, targetSquare) {

        let players = this.players;
        let playerOneCheckers = players[0].checkersLeft;
        let playerTwoCheckers = players[1].checkersLeft;
        let playerCheckers = player.checkersLeft;
        let isStalemate = false;


        let possibleMoves = playerCheckers.filter(checker => {

            let moves = new Moves(player, targetSquare, this.squares);
            let possibleMoves = moves.possibleMoves(targetSquare);


            return possibleMoves.moves;
        });

        if(possibleMoves.length !== 0) {
            isStalemate = true;
        }
        this.determineWinner("noMoves");

       
    }

    //function to end the Game
    //Params - player - object
    //Returns - N/A
    outputWinner(player) {
        let winnerModal = document.createElement('div');
        winnerModal.classList.add('winner_modal');
        document.body.append(winnerModal);

    }

}