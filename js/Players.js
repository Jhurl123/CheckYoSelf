class Player {
    constructor(name, id, color, squares) {
        this.name     = name;
        this.id       = id;
        this.color    = color;
        this.checkers = this.createCheckers();
        this.squares  = squares;

    }

    //get method that gets the checkers the player has left
    get checkersLeft() {

        let checkers = this.checkers;
        let tokensLeft = checkers.filter(checker => !checker.taken);
        return tokensLeft;
        
    }

    //instantiates checkers objects for each player
    createCheckers() {

        let checkers = [];
        for(let i = 0; i < 12; i++) {
            let token = new Checker(this.id, i, 'single', this, false);
            checkers.push(token);
        }

        return checkers;

    }   

    //method that calls render method and adds the checker object to square object
    //issue with the for loop here adding to the 
   displayCheckers() {

        let squares = this.squares;
    
        for(let i = 0; i < squares.length; i++) {
           
            if(this.squares[i].id === 'black-square') {
                this.squares[i].checker = this.checkers[i];
                this.checkers[i].renderCheckers(this.color, this.squares[i]);
            }

        }
        
    }

}