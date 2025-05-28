const term = require( 'terminal-kit' ).terminal ;
const { FEATURE_SYMBOLS } = require('../config/constants.js');


class TerminalManager {
    constructor() {
        this.term = term;
    }
    grabInput(){
        this.term.grabInput();
    }

    showMessage(message, isWin = false, field) {
        this.term.moveTo(0,field.matrix.length+2);
        if (isWin) {
            this.term.green(message);
        } else {
            this.term.red(message);
        }
        this.term.down(2);
    }

    updatePosition(field,moveResult='OK'){ // updates
        const x = field.x, y = field.y;
        const currentChar = field.matrix[y][x];
        this.term.moveTo(x+1,y+1);
        if(moveResult == 'HAT'){
            this.term.bgGreen(FEATURE_SYMBOLS.hat);
        } else if (moveResult == 'HOLE' || moveResult == 'OUT_OF_BOUNDS'){
            this.term.bgRed(currentChar);
        } else {
            this.term.bgBlack().white(currentChar);
        }
    }

    renderField(field, mazeSolution=null){
        this.term.moveTo(1,1);
        for(let i=0; i<field.matrix.length; i++){
            for(let j=0; j<field.matrix[0].length; j++){
                const currentChar = field.matrix[i][j];
                switch(currentChar){
                    case FEATURE_SYMBOLS.path:
                        if(field.y == i && field.x == j){ // if path is current location
                            this.term.bgBlue(currentChar); // highligths path character
                        } else {
                            this.term.bgBlack().white(currentChar);
                        }
                        break;
                    case FEATURE_SYMBOLS.hat:
                        this.term.bgBrightCyan().black(currentChar); // highligths hat
                        break;
                    default: 
                        if(mazeSolution && mazeSolution[i][j]===true){ // if maze solution is given
                            this.term.bgBrightBlack(currentChar); // highlight solution path
                        } else { 
                            this.term.bgBlack().white(currentChar); // otherwise, just print current character
                        }            
                }
                // this.term(`[${i},${j}]`);
            }
            this.term.move(-field.matrix[0].length,1); // moves to next line
        }
        this.term.moveTo(field.x+1,field.y+1);
    }

    cleanup() {
        this.term.grabInput(false);
        this.term.hideCursor(false);
        this.term.clear();
    }

}


module.exports = TerminalManager;
