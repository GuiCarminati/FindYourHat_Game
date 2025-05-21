const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

class Field {
  constructor(field2dMatrix){
    this._field = field2dMatrix;
    this._x = 0;
    this._y = 0;
    this._field[this._x][this._y] = '*';
  }
  
  static generateField(numRows, numCols, holesPercentage){
    holesPercentage = holesPercentage>1 ? holesPercentage/100 : holesPercentage; // adjust percentage to 0-1, if not yet
    if(holesPercentage>1 || holesPercentage<0 || numCols<=0 || numRows<=0) {
        throw new Error('invalid percentage, number of rows or columns ')
    }    
    const totalCells = numCols*numRows;
    const totalHoles = Math.floor(totalCells * holesPercentage);
    let array2D = new Array(numRows).fill().map(() => new Array(numCols).fill('░'));
    array2D[0][0] = '*';
    let tempArrayOFeatures = new Array(totalHoles+1).fill('O');
    tempArrayOFeatures[0] = '^';
    console.table(array2D)
    console.table(tempArrayOFeatures)
    let featuresCount = 0;
    while(featuresCount < totalHoles+1){
        const randRow = Math.floor(Math.random() * numRows);
        const randCol = Math.floor(Math.random() * numCols);
        const randCell = array2D[randRow][randCol];
        if(randCell === '░'){
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

  updatePath(direction){
    let newX = this._x;
    let newY = this._y;
    switch (direction) {
        case 'up':
            newY--; break;
        case 'down':
            newY++; break;
        case 'left':
            newX--; break;
        case 'right':
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
    this._field[this._y][this._x] = '*';
    return true;
  }

  isHole(newX,newY){
    return this._field[newY][newX] === 'O';
  }

  isHat(newX,newY){
    return this._field[newY][newX] === '^';
  }

  isOutOfBounds(newX, newY){
    const fieldWidth = this._field[0].length;
    const fieldHeight = this._field.length;
    if((newY >= fieldHeight) || (newY < 0) ) return true;
    if((newX >= fieldWidth) || (newX < 0) ) return true;
    return false; 
  }
}

const myField = new Field([
  ['░', '░', 'O'],
  ['░', 'O', '░'],
  ['░', '^', '░'],
]);

// myField.print();

// move('down',myField);
// move('down',myField);
// move('right',myField);


function move(direction, field){
    try{
        field.updatePath(direction);
        // field.print();
        return true;
    } catch(e){
        console.error(e.message);
        return false;
    }
}

function getDirection(){
    while(true){    
        let input = prompt('Which way? ').toLowerCase();
        switch(input){
            case 'u':
                return 'up';
            case 'd':
                return 'down';
            case 'l':
                return 'left';
            case 'r':
                return 'right';
            default:
                const error = new Error("Invalid input. Please one of the folowing characters: U (up), D (down), L (left) or R (right)");
                console.error(error.message);
        }
    }
}


const autoField = new Field(Field.generateField(5,10,0.2));

// autoField.print()

let gameOver = false;
while(!gameOver){
    autoField.print();
    let direction = getDirection();
    gameOver = !move(direction,autoField);
}