class Moves {
    constructor(player, square, squares) {
        this.player         = player;
        this.square         = square;
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

getPossibleDirections(square, checker) {

    //first number of squares id, index
    let x = square.x;
    //second number of squares id, index
    let y = square.y;
    let yMoves = [];
    let xMoves = [x-1, x+1];

    //if player 1, all you need is up/left and up/right
    if(this.player.id === 1) {

        //check if it is a single piece or king
        if(checker.power === 'single') {
            yMoves.push(y-1);
        }
        else {
            yMoves.push(y+1);
            yMoves.push(y-1);
        }

    }
    //if player 2, you only need down/left down/right
    else if(this.player.id === 2) {
        //check if it is a single piece or king
        if(checker.power === 'single') {
            yMoves.push(y+1);
        }
        else {
            yMoves.push(y+1);
            yMoves.push(y-1);
        }

    }

    let newDirections = this.getPossibleMoves(yMoves, xMoves);

    return newDirections;

}

//Function to determine if square exists/has piece in it
//params - square - object, directions - object literal
//return - array
getPossibleMoves(yMoves, xMoves) {

    let squares = this.squaresArray;
    let openSquares = [];
    let enemyCheckers = [];
    //determine if the moves are on the board
    xMoves = xMoves.map(move => {
        if(move >= 0 && move < 8) {
            return move;
        }
    });
    yMoves = yMoves.map(move => {
        if(move >= 0 && move < 8) {
            return move;
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

    console.log(openSquares);
    let tempArray = openSquares.slice();
    console.log(tempArray);
    //loop that checks for checkers and adjusts moves accordingly
   for(let i =0; i < openSquares.length; i++) {

        //call function to allow the jump over enemy piece
        if(openSquares[i].checker) {

            if(openSquares[i].checker.owner === this.player.name) { 

               openSquares[i] = false;

            }
           else {
               
                let jumpMove = this.jumpEnemyMove(yMoves, openSquares[i]);
                openSquares[i] = jumpMove;
                if(openSquares[i]) {
                    openSquares[i].jumpSquare = true;
                    if(openSquares[i].checker){
                        openSquares[i] = false;
                    }
                }

            }
        }
    }   

    openSquares = openSquares.filter( square => {
        return square;
    });
   

   return openSquares;

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
jumpEnemyMove(yMoves, enemySquare) {

    enemySquare.jumpSquare = true;
    let square             = this.convertSquareToObject(this.square);
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

    return jumpMoves;
}

}