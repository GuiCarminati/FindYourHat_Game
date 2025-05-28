const { FEATURE_SYMBOLS, DIRECTIONS } = require('../config/constants');

class Field {
  constructor(field2dMatrix,startingX=0,startingY=0,xHat,yHat){
    this.matrix = field2dMatrix;
    this.x = startingX;
    this.y = startingY;
    this.xHat = xHat;
    this.yHat = yHat;
  }

    updatePath(input){
        let newX = this.x;
        let newY = this.y;
        switch (input) {
            case DIRECTIONS.up:
                newY--; break;
            case DIRECTIONS.down:
                newY++; break;
            case DIRECTIONS.left:
                newX--; break;
            case DIRECTIONS.right:
                newX++; break; 
        }

        if(this.isOutOfBounds(newX,newY)) return "OUT_OF_BOUNDS";

        if(this.isNewPath(newX,newY)){ // only move if not visited path before (can't backtrack)
            this.x = newX;
            this.y = newY;
            if(this.isHole(newX,newY)) return "HOLE";
            if (this.isHat(newX,newY)) return "HAT";
            this.matrix[this.y][this.x] = FEATURE_SYMBOLS.path;
            return "OK";
        }
        return "NO_MOVE";
    }

    isHole(newX,newY){
        return this.matrix[newY][newX] === FEATURE_SYMBOLS.hole;
    }

    isHat(newX,newY){
        return this.matrix[newY][newX] === FEATURE_SYMBOLS.hat;
    }  
    isNewPath(newX,newY){
        return this.matrix[newY][newX] !== FEATURE_SYMBOLS.path;
    }
    isEmptyFieldCharacter(newX,newY){    
        return this.matrix[newY][newX] === FEATURE_SYMBOLS.field;
    }

    isOutOfBounds(newX, newY){
        const fieldWidth = this.matrix[0].length;
        const fieldHeight = this.matrix.length;
        if((newY >= fieldHeight) || (newY < 0) ) return true;
        if((newX >= fieldWidth) || (newX < 0) ) return true;
        return false; 
    }
}

module.exports = Field;