(function() {
    //hideBoard();
   //popupForm();
   
   var game = new Game();
   
   game.startGame();

})();

function hideBoard() {

    var board = document.querySelector('.board');
    board.style.display="none";
}

function showBoard() {

    var board = document.querySelector('.board');
    board.style.display="grid";
}

function popupForm() {

    var form  = document.querySelector('.player-form');
    var modal = document.querySelector('.popup-modal');
    form.addEventListener('submit',function(e) {
        e.preventDefault();

        let player1 = document.querySelector('#playerOne').value;
        let player2 = document.querySelector('#playerTwo').value;
        let names   = [player1, player2];
        var game = new Game(names);

        modal.style.display = 'none';
        showBoard();
        
        game.startGame();

    });

}

