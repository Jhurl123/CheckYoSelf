class Moves {
    constructor(player, squares) {
        this.player         = player;
        this.squaresArray   = squares;
    }

/*
*
*
* single pieces may only move forward, kings may move any direction
* only one piece may be captured per turn, however multiple turns are allowed
* If a capture can be made, it must be made, player gets choice of which one if there are multiple possibilities
* 
*/
//must take into account the users postion(player 1 or 2)
//single player 1 can move up only and single player 2 can move down only
possibleMoves(square) {

    //get the square object associated the square element
    square = this.convertSquareToObject(square);

    //set to the checker object in the square
    let checker = square.checker;

    let directions = this.getPossibleDirections(square, checker);

    //method should return the remaining valid spaces
    return directions;
}

//Gives the possible directions a piece can move 
// Determined by the power of the active checker
getPossibleDirections(square, checker) {

    //first number of squares id, index
    let x = square.x;
    //second number of squares id, index
    let y = square.y;
    let yMoves = [];
    let xMoves = [x-1, x+1];

    //if player 1, all you need is up/left and up/right
    if(this.player.id === 1) {

        if(checker) {
        //check if it is a single piece or king
            if(checker.power === 'single') {
                yMoves.push(y-1);
            }
            else {
                yMoves.push(y+1);
                yMoves.push(y-1);
            }
        }

    }
    //if player 2, you only need down/left down/right
    else if(this.player.id === 2) {

        if(checker) {
            //check if it is a single piece or king
            if(checker.power === 'single') {
                yMoves.push(y+1);
            }
            else {
                yMoves.push(y+1);
                yMoves.push(y-1);
            }
        }

    }

    let newDirections = this.getPossibleMoves(yMoves, xMoves, square);

    return newDirections;

}

//Function to determine the moves a piece can take - both regular and jump moves calculated here
//params - square - object, directions - object literal
//return - object literal containing possible moves and the squares to jump
getPossibleMoves(yMoves, xMoves, square) {

    let squares        = this.squaresArray;
    let openSquares    = [];
    let enemyCheckers  = [];
    let squaresToJump  = [];

    //determine if the moves are on the board
    xMoves = xMoves.filter(move => {
        if(move >= 0 && move < 8 ) {
            return true;
        }
    });

    yMoves = yMoves.filter(move => {
        if(move >= 0 && move < 8) {
            return true;
        }
    });

    for( let i = 0; i < yMoves.length; i++) {
        for(let j = 0; j < xMoves.length; j++) {
            if(squares[xMoves[j]]) {
                if(squares[xMoves[j]][yMoves[i]]) {

                    //need to let checker  equal the opensquares checker not the current square
                    openSquares.push(squares[xMoves[j]][yMoves[i]]);
                }
            }
        }
    }
    //loop that checks for checkers and adjusts moves accordingly
   for(let i =0; i < openSquares.length; i++) {

        //call function to allow the jump over enemy piece
        if(openSquares[i].checker) {

                //if the piece belongs to active player, don't give a  jump move
            if(openSquares[i].checker.owner.name === this.player.name) { 

                openSquares[i] = false;
                squaresToJump.push(null);

            }
            else {
        
                squaresToJump.push(openSquares[i]);
                //get the square that will be jumped to if enemy piece was present
                let jumpMove = this.jumpEnemyMove(yMoves, openSquares[i], square);
                openSquares[i] = jumpMove;

                if(openSquares[i]) {

                    //if jumpSqaure has a piece in it return false
                    if(openSquares[i].checker){
                        squaresToJump[i] = null;
                        openSquares[i] = false;
                    }
                
                }
                else {
                    squaresToJump[i] = null;
                }

            }

        }
        else {
            
            squaresToJump.push(null);
        }

    }   

    //filters the false values, but keeps the null values
    for(let i = 0; i < openSquares.length; i++ ) {
        if(openSquares[i] === false || openSquares[i] === undefined) {
            openSquares.splice(i,1);
            squaresToJump.splice(i,1);
        }

        //This part handles the rule, that if there is a jump move, it must be made
        if(!squaresToJump.every(element => element === null)) {
            openSquares = this.mandatoryJump(openSquares, squaresToJump, i);
        }
    }

    openSquares = openSquares.filter(move => { return move});
    if(openSquares.length == 0 ) {
        squaresToJump = squaresToJump.filter(move => { return move});
    }
   // console.log(squaresToJump);

   return {
        'moves': openSquares,
        'jumps': squaresToJump
    };

}

// function to turn element into square object
// params(square - HTML Element)
// return Square object
convertSquareToObject(square) {

    let id           = square.dataset.id;
    let x            = parseInt(id[0]);
    let y            = parseInt(id[2]);
    let squareList   = this.squaresArray;
    let squareObject = squareList[x][y];

    return squareObject;

}

// function to turn element into checker object
// params(checker - HTML Element)
// return checker object  
convertCheckerToObject(checker, player) {

    let id            = checker.dataset.checker;
    let  y            = parseInt(id[2]);
    let checkers      = player.checkersLeft;
    let checkerObject = checkers[y];

    return checkerObject;
}

//function to add account for possible moves when enemy piece is in the way
jumpEnemyMove(yMoves, enemySquare, playerSquare) {

    let square             = playerSquare;
    let squares            = this.squaresArray; 
    let horizontalSquare   = '';
    let verticalSquare     = '';
    let jumpMoves          = [];

    if(enemySquare.x > square.x) {
        horizontalSquare = enemySquare.x+1;
    }
    else {
        horizontalSquare = enemySquare.x-1;
    }

    if(enemySquare.y > square.y) {
        verticalSquare = enemySquare.y + 1;
    }
    else {
        verticalSquare = enemySquare.y -1;
    } 

    for(let i = 0; i< squares.length; i++) {
        jumpMoves = squares[i].find( square => {
        
            if(square.x === horizontalSquare && square.y === verticalSquare) {
                return square;
            }
           
        });

        if(jumpMoves) break;


    }

    if(jumpMoves) {
        if(jumpMoves.length > 0 ) {
            jumpMoves = jumpMoves.filter(move => {
                if(move.x !== 0 && move.x !== 8) {
                    if(move.y !== 0 && move.y !== 8){
                        return move;
                    }
                }
            }); 
        }

    }
    
    return jumpMoves;
}

// Funtion to enforce the mandatory jump, strips non jump moves if there's a jump move available
//Params - openSquares - array of Objects, squaresToJump - array of objects
//returns - openSquares array of objects
mandatoryJump(openSquares, squaresToJump, idx) {
    if(squaresToJump[idx] === null) {
        openSquares.splice(idx,1);
    }
    return openSquares;
}
}