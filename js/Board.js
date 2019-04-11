class Board {

    constructor() {
        this.rows    = 8;
        this.columns = 8;
        this.squares = this.createSquares();
    }

    //create the square objects on the board
    createSquares() {

        let squares = [];
        for(let i = 0; i < this.rows; i++) {
            let columns = [];
            for(let j = 0; j < this.columns; j++) {
                let newSquare = new Squares(i, j);
                if(j % 2 == 0) {
                    if(i % 2 !== 0) {
                        newSquare.id = "black-square";
                    }
                    else {
                        newSquare.id = "red-square";
                    }
                }
                else {
                    if(i % 2 == 0) {
                        newSquare.id = 'black-square';
                    }
                    else {
                        newSquare.id = "red-square";
                    }
                }
                columns.push(newSquare)
            }
            squares.push(columns);
        }

        return squares;
    
    }

    //Render the above squares on the board
    renderSquares() {
        let squares = this.squares;
        let board   = document.querySelector('.board');
        
        for(let i=0; i < squares.length; i++) {
            for(let j=0; j < squares[i].length; j++) {

                let squareDiv = document.createElement('div');

                squareDiv.classList.add('Square-' + j + '-' + i);
                squareDiv.classList.add('squares');
                squareDiv.setAttribute('data-id', j +',' + i );

                if(j % 2 == 0) {
                    if(i % 2 !== 0) {
                      
                        squareDiv.classList.add('black-squares');
                    }
                    else{
                        
                        squareDiv.classList.add('red-squares');
                    }
                }
                else {
                    if(i % 2 == 0) {
                        
                        squareDiv.classList.add('black-squares');
                        
                    }
                    else {
                        
                        squareDiv.classList.add('red-squares');
                    }

                }

                board.appendChild(squareDiv);
            }
        }

    }

}