const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

class Field {
  constructor(field){
    this._field = field;
    this._x = 0;
    this._y = 0;
    this._field[this._x][this._y] = '*';
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
        throw new Error('Game over. You found the hat! You won!');
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

myField.print();

move('down',myField);
move('down',myField);
move('right',myField);


function move(direction, field){
    try{
        field.updatePath(direction);
        field.print();
        return true;
    } catch(e){
        console.error(e.message);
        return false;
    }
}