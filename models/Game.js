const { DIRECTIONS } = require('../config/constants.js');
const TerminalManager = require('../utils/display.js');
const FieldGenerator = require('../utils/fieldGenerator.js');

const validInputs = Object.values(DIRECTIONS);  // ['UP', 'DOWN', 'LEFT', 'RIGHT']


class Game {
    constructor(field){
        this.field = field;
        this.cleanupHandlers = [];
        this.display = new TerminalManager();
        this.isActive = true;
    }

    run(withSolution=false) {
        const solution = withSolution ? FieldGenerator.isSolvable(this.field).correctPath : null;
        this.display.renderField(this.field,solution); // show solution if true, solution=null won't show it
        this.display.grabInput();
        // this.registerCleanup(() => {
        //     this.display.cleanup();
        // });
        this.display.term.on( 'key' , this.handleMove.bind(this) ) ;
    }

    handleMove(key){
        if(key === 'CTRL_C') this.exitGame('Game exited.');
        if(!validInputs.includes(key)) return; 

        const moveResult = this.field.updatePath(key);
        this.display.updatePosition(this.field,moveResult);
        switch (moveResult) {
            case 'OUT_OF_BOUNDS':
                this.exitGame('Game over. You ran out of bounds!',false);
                break;
            case 'HOLE':
                this.exitGame('Game over. You fell into a hole!',false);
                break;
            case 'HAT':
                this.exitGame('You found the hat! You won!',true);
                break;
            default:
                this.display.updatePosition(this.field,moveResult);
        }
        
    }   

    registerCleanup(handler) {
        this.cleanupHandlers.push(handler);
    }

    exitGame(message, isWin = false) {
        this.isActive = false;
        this.cleanupHandlers.forEach(handler => handler());
        this.display.showMessage(message, isWin, this.field);
        process.exit(isWin ? 0 : 1);
    }

}

module.exports = Game;