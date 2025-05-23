const term = require( 'terminal-kit' ).terminal ;

const feature = {
    hat: '^',
    hole: 'O',
    fieldCharacter: '░',
    pathCharacter: '*'
}
const direction = {
    up: 'UP',
    down: 'DOWN',
    left: 'LEFT',
    right: 'RIGHT'
}
const validInputs = Object.values(direction);  // ['u', 'd', 'l', 'r']

class Field {
  constructor(field2dMatrix){
    this._field = field2dMatrix;
    this._x = 0;
    this._y = 0;
    this._field[0][0] = feature.pathCharacter; // set starting position
  }

  runGame() {
    this.print();
    term.saveCursor();
    term.moveTo(1,1);

    term.grabInput();

    term.on( 'key' , this.move.bind(this) ) ;
 }

  move(key){
    if(key === 'CTRL_C') process.exit();
    if(validInputs.includes(key)) {
        try{
            this.updatePath(key);
        } catch(e){
            term.restoreCursor();
            console.error(e.message);
            process.exit();
        }
    }
  }

  updatePath(input){
    let newX = this._x;
    let newY = this._y;
    switch (input) {
        case direction.up:
            newY--; break;
        case direction.down:
            newY++; break;
        case direction.left:
            newX--; break;
        case direction.right:
            newX++; break; 
    }

    if(this.isOutOfBounds(newX,newY)){
        term.bgRed(feature.pathCharacter);
        throw new Error('Game over. You ran out of bounds!');
    }
    if(this.isNewPath(newX,newY)){
        term.moveTo(newX+1,newY+1);
        if(this.isHole(newX,newY)){
            term.bgRed(feature.hole);
            throw new Error('Game over. You fell into a hole!');
        }
        
        if (this.isHat(newX,newY)) {       
            term.bgGreen(feature.hat);
            throw new Error('You found the hat! You won!');
        }
        term('*').left(1);
        this._x = newX;
        this._y = newY;
        this._field[this._y][this._x] = feature.pathCharacter;
    }

}


  static generateField(numRows=5, numCols=10, holesPercentage=0.2){
    holesPercentage = holesPercentage>1 ? holesPercentage/100 : holesPercentage; // adjust percentage to 0-1, if not yet
    if(holesPercentage>1 || holesPercentage<0 || numCols<=0 || numRows<=0) {
        throw new Error('invalid percentage, number of rows or columns ')
    }    
    const totalCells = numCols*numRows;
    const totalHoles = Math.floor(totalCells * holesPercentage);
    let array2D = new Array(numRows).fill().map(() => new Array(numCols).fill(feature.fieldCharacter));
    array2D[0][0] = feature.pathCharacter;
    let tempArrayOFeatures = new Array(totalHoles+1).fill(feature.hole);
    tempArrayOFeatures[0] = feature.hat;
    // console.table(array2D)
    // console.table(tempArrayOFeatures)
    let featuresCount = 0;
    while(featuresCount < totalHoles+1){ // distribute each feature (holes 'O' and hat '^') randomly accross the field
        const randRow = Math.floor(Math.random() * numRows);
        const randCol = Math.floor(Math.random() * numCols);
        const randCell = array2D[randRow][randCol];
        if(randCell === feature.fieldCharacter){
            array2D[randRow][randCol] = tempArrayOFeatures.pop();
            featuresCount++
        }
    }

    return array2D;



}

  print(){  // prints each row of the field 2d matrix as a single concatenated string (eg. ░*░O░░░) in a new line
    this._field.forEach(row => {
        let lineStr = "";
        row.forEach(el => lineStr+=el);
        console.log(lineStr)
    }); 
  }


  isHole(newX,newY){
    return this._field[newY][newX] === feature.hole;
  }

  isHat(newX,newY){
    return this._field[newY][newX] === feature.hat;
  }  
  isNewPath(newX,newY){
    return this._field[newY][newX] !== feature.pathCharacter;
  }
//   isEmptyField(newX,newY){
//     return this._field[newY][newX] === feature.fieldCharacter;
//   }

  isOutOfBounds(newX, newY){
    const fieldWidth = this._field[0].length;
    const fieldHeight = this._field.length;
    if((newY >= fieldHeight) || (newY < 0) ) return true;
    if((newX >= fieldWidth) || (newX < 0) ) return true;
    return false; 
  }
}



// const fieldEasy = new Field(Field.generateField(5,10,0.2));
const fieldMedium = new Field(Field.generateField(10,20,0.3));
const fieldHard = new Field(Field.generateField(25,50,0.3));


// fieldEasy.runGame();
// fieldMedium.runGame();
fieldHard.runGame();


// fieldMedium.runGame();
