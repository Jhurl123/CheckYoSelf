class Checker {
    constructor(id, index, power, owner, taken = false) {
        this.class  = `checker-${id}-${index}`;
        this.id     = id;
        this.index  = index;
        this.power  = power;
        this.owner  = owner;
        this.taken  = taken;
    }

    //owner of piece may change over time

    get position() {
        let square     = document.getElementById(this.id);
        let parent     = square.parentElement;
        let firstClass =  parent.classList[0];

        let position = parseInt(firstClass.replace(/[^0-9\.]/g, ''), 10);
        return this.position = parent ;
    }

    renderCheckers(color, position) {
        let token = document.createElement('div');
        token.setAttribute('data-checker', this.id + ',' + this.index);
        let square = document.querySelector(`[data-id="${position.x},${position.y}"]`);
        token.classList.add('checker');
        token.style.backgroundColor = color;
        square.appendChild(token);

    }

    //Function to give the checker piece the king powers
    // Params - checker Object
    //returns - N/A
    kingChecker(){
        console.log("kinged");
        this.power = 'king';
        let checkerElement = document.querySelector('[data-checker="' + this.id + ',' + this.index + '"]');
        checkerElement.classList.add('kinged');
    }
    
}