const term = require( 'terminal-kit' ).terminal ;
const solveMaze = require('./modules/mazeSolver.js').solveMaze;
const { FEATURE_SYMBOLS, DIRECTIONS } = require('./config/constants'); //require('../config/constants');


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
const validInputs = Object.values(DIRECTIONS);  // ['u', 'd', 'l', 'r']

class Field {
  constructor(field2dMatrix){
    this._field = field2dMatrix;
    let startingX, startingY;
    // this.print()
    do{
        startingX = Math.floor(Math.random() * field2dMatrix[0].length)
        startingY = Math.floor(Math.random() * field2dMatrix.length)
    } while(!this.isEmptyFieldCharacter(startingX,startingY));
    this._x = startingX;
    this._y = startingY;
    this._field[this._y][this._x] = FEATURE_SYMBOLS.path; // set random position
    const hatCoords= this.findHat(); // saves Hat position
    this._xHat = hatCoords[0];
    this._yHat = hatCoords[1];
  }

  runGame() {
    this.printAlt();
    // this.print();
    term.saveCursor();
    // term.moveTo(this._xHat+1,this._yHat+1); 
    // term.bgBrightCyan().black(FEATURE_SYMBOLS.hat); // highligths hat
    term.moveTo(this._x+1,this._y+1);
    // term.bgBlue(FEATURE_SYMBOLS.path).left(1); // highlights starting path character

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
        case DIRECTIONS.up:
            newY--; break;
        case DIRECTIONS.down:
            newY++; break;
        case DIRECTIONS.left:
            newX--; break;
        case DIRECTIONS.right:
            newX++; break; 
    }

    if(this.isOutOfBounds(newX,newY)){
        term.bgRed(FEATURE_SYMBOLS.path);
        throw new Error('Game over. You ran out of bounds!');
    }
    if(this.isNewPath(newX,newY)){
        term.moveTo(newX+1,newY+1);
        if(this.isHole(newX,newY)){
            term.bgRed(FEATURE_SYMBOLS.hole);
            throw new Error('Game over. You fell into a hole!');
        }
        
        if (this.isHat(newX,newY)) {       
            term.bgGreen(FEATURE_SYMBOLS.hat);
            throw new Error('You found the hat! You won!');
        }
        term('*').left(1);
        this._x = newX;
        this._y = newY;
        this._field[this._y][this._x] = FEATURE_SYMBOLS.path;
    }

  }


  static generateField(numRows=5, numCols=10, holesPercentage=0.2){
    holesPercentage = holesPercentage>1 ? holesPercentage/100 : holesPercentage; // adjust percentage to 0-1, if not yet
    if(holesPercentage>1 || holesPercentage<0 || numCols<=0 || numRows<=0) {
        throw new Error('invalid percentage, number of rows or columns ')
    }    
    const totalCells = numCols*numRows;
    const totalHoles = Math.floor(totalCells * holesPercentage);
    let newField, solveObj, count=0;
    do{
      let array2D = new Array(numRows).fill().map(() => new Array(numCols).fill(FEATURE_SYMBOLS.field));
      // array2D[0][0] = FEATURE_SYMBOLS.path;
      let tempArrayOFeatures = new Array(totalHoles+1).fill(FEATURE_SYMBOLS.hole);
      tempArrayOFeatures[0] = FEATURE_SYMBOLS.hat;
      // console.table(array2D)
      // console.table(tempArrayOFeatures)
      let featuresCount = 0;
      while(featuresCount < totalHoles+1){ // distribute each feature (holes 'O' and hat '^') randomly accross the field
          const randRow = Math.floor(Math.random() * numRows);
          const randCol = Math.floor(Math.random() * numCols);
          const randCell = array2D[randRow][randCol];
          if(randCell === FEATURE_SYMBOLS.field){
              array2D[randRow][randCol] = tempArrayOFeatures.pop();
              featuresCount++
          }
      }

      newField = new Field(array2D);

      // newField.print();
      solveObj = newField.isSolvable();

      // if(solveObj.solvable) 
      // newField.printAlt()

      // newField.printAlt(solveObj.correctPath)

      // term.moveTo(0,array2D.length+10);
      // newField.print();

      // term.move(-newField._field[0].length,2);

      // console.log('is solvable: '+solveObj.solvable);
      count++;
    }while(!solveObj.solvable);
    term.moveTo(0,newField._field.length+2);
    console.log('generated: '+count)
    term.moveTo(1,1);
    return newField;
  }

  isSolvable(){
    let boolean2DArray = []; 
    this._field.forEach((row,i) => {
      let booleanRow = [];
      row.forEach((el,j) => {
        booleanRow.push(el === FEATURE_SYMBOLS.hole); // fill array wtih false, and true if hole/wall ('O') 
      });
      boolean2DArray.push(booleanRow);
    }); 

    const printSolvePath = (solveArray,path='░',wall='O') => {
      solveArray.forEach(row => {
          let lineStr = "";
          row.forEach(el => {
              lineStr+=(el ? wall : path)
          });
          console.log(lineStr)
      }); 
    }
    // printSolvePath(boolean2DArray)

    return solveMaze(boolean2DArray,this._x,this._y,this._xHat,this._yHat);
  }

  print(){  // prints each row of the field 2d matrix as a single concatenated string (eg. ░*░O░░░) in a new line
    this._field.forEach(row => {
        let lineStr = "";
        row.forEach(el => lineStr+=el);
        console.log(lineStr)
    }); 
  }

  printAlt(solvedMazed=null){
    for(let i=0; i<this._field.length; i++){
      // term.moveTo(0,i)
      for(let j=0; j<this._field[0].length; j++){
        const currentChar = this._field[i][j]
        switch(currentChar){
          case FEATURE_SYMBOLS.path:
            term.bgBlue(currentChar); // highligths path character
            break;
          case FEATURE_SYMBOLS.hat:
            term.bgBrightCyan().black(currentChar); // highligths hat
            break;
          default: 
            if(solvedMazed && solvedMazed[i][j]===true){
              term.bgBrightBlack(currentChar);
            } else { term.bgBlack().white(currentChar); }
            // term(currentChar);
            
        }
        // term(`[${i},${j}]`);
      }

      term.move(-this._field[0].length,1);
    }
  }

  findHat(){
    for(let y=0; y<this._field.length; y++){
      for(let x=0; x<this._field[0].length; x++){
        if(this._field[y][x] === FEATURE_SYMBOLS.hat) return [x,y];
      }
    }
  }

  isHole(newX,newY){
    return this._field[newY][newX] === FEATURE_SYMBOLS.hole;
  }

  isHat(newX,newY){
    return this._field[newY][newX] === FEATURE_SYMBOLS.hat;
  }  
  isNewPath(newX,newY){
    return this._field[newY][newX] !== FEATURE_SYMBOLS.path;
  }
  isEmptyFieldCharacter(newX,newY){    
    return this._field[newY][newX] === FEATURE_SYMBOLS.field;
  }

  isOutOfBounds(newX, newY){
    const fieldWidth = this._field[0].length;
    const fieldHeight = this._field.length;
    if((newY >= fieldHeight) || (newY < 0) ) return true;
    if((newX >= fieldWidth) || (newX < 0) ) return true;
    return false; 
  }
}



// const fieldEasy = Field.generateField(5,10,0.2);
// const fieldMedium = Field.generateField(10,20,0.3);
const fieldHard = Field.generateField(25,50,0.4);

// fieldEasy.runGame();
// fieldMedium.runGame();
fieldHard.runGame();


// fieldMedium.runGame();
