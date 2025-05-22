const prompt = require('prompt-sync')({sigint: true});

const feature = {
    hat: '^',
    hole: 'O',
    fieldCharacter: '░',
    pathCharacter: '*'
}
const direction = {
    up: 'u',
    down: 'd',
    left: 'l',
    right: 'r'
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
    let keepPlaying = true;
    while(keepPlaying){
        this.print();
        keepPlaying = this.move(this.getDirection());
    }
  }

  move(dir){
    try{
        this.updatePath(dir);
        return true;
    } catch(e){
        console.error(e.message);
        return false;
    }
}

getDirection(){
    while(true){    
        let input = prompt('Which way? ').toLowerCase();

        if(validInputs.includes(input)) return input; //

        // continue while input is invalid
        const error = new Error("Invalid input. Please one of the folowing characters: U (up), D (down), L (left) or R (right)");
        console.error(error.message); 
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
    // console.log(`newX: ${newX}, newY: ${newY}`);
    
    if(this.isOutOfBounds(newX,newY)){
        // console.log('Game over. You ran out of bounds!');
        
        throw new Error('Game over. You ran out of bounds!');
    }
    if(this.isHole(newX,newY)){
        // console.log('Game over. You fell into a hole!');
        throw new Error('Game over. You fell into a hole!');
    }
    if (this.isHat(newX,newY)) {
        // console.log('Game over. You found the hat! You won!')
        throw new Error('You found the hat! You won!');
    }
    // console.log('path updated');
    
    this._x = newX;
    this._y = newY;
    this._field[this._y][this._x] = feature.pathCharacter;
    return true;
  }

  isHole(newX,newY){
    return this._field[newY][newX] === feature.hole;
  }

  isHat(newX,newY){
    return this._field[newY][newX] === feature.hat;
  }

  isOutOfBounds(newX, newY){
    const fieldWidth = this._field[0].length;
    const fieldHeight = this._field.length;
    if((newY >= fieldHeight) || (newY < 0) ) return true;
    if((newX >= fieldWidth) || (newX < 0) ) return true;
    return false; 
  }
}

const fieldEasy = new Field(Field.generateField(5,10,0.2));
const fieldMedium = new Field(Field.generateField(10,20,0.3));
const fieldHard = new Field(Field.generateField(25,50,0.4));

// fieldEasy.runGame();
fieldMedium.runGame();
// fieldHard.runGame();