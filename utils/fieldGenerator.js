const { solveMaze } = require("../modules/mazeSolver.js");
const { FEATURE_SYMBOLS } = require('../config/constants.js');
const Field = require('../models/Field.js')

class FieldGenerator {
    static generateField(numRows=5, numCols=10, holesPercentage=0.2){
        holesPercentage = holesPercentage>1 ? holesPercentage/100 : holesPercentage; // adjust percentage to 0-1, if not yet
        if(holesPercentage>1 || holesPercentage<0 || numCols<=0 || numRows<=0) {
            throw new Error('invalid percentage, number of rows or columns ')
        }    
        const totalCells = numCols*numRows;
        const totalHoles = Math.floor(totalCells * holesPercentage);
        let newField, solveObj, fieldsGenerated=0;
        let startingX,startingY,hatX,hatY;
        do{
            let array2D = new Array(numRows).fill().map(() => new Array(numCols).fill(FEATURE_SYMBOLS.field));
            let tempArrayOFeatures = new Array(totalHoles).fill(FEATURE_SYMBOLS.hole); // temp array with all holes
            tempArrayOFeatures.push(FEATURE_SYMBOLS.hat); // add 1 hat to array of features
            tempArrayOFeatures.push(FEATURE_SYMBOLS.path); // add 1 path to array of features
            let featuresCount = 0;
            while(featuresCount < totalHoles+1){ 
                // distribute each feature (holes 'O',  hat '^', path '*') randomly accross the field
                const randRow = Math.floor(Math.random() * numRows);
                const randCol = Math.floor(Math.random() * numCols);
                const randCell = array2D[randRow][randCol];
                if(randCell === FEATURE_SYMBOLS.field){
                    let currentFeature = tempArrayOFeatures.pop();
                    array2D[randRow][randCol] = currentFeature;
                    if(currentFeature === FEATURE_SYMBOLS.path){
                        startingX = randCol;
                        startingY = randRow;
                    } else if (currentFeature === FEATURE_SYMBOLS.hat) {
                        hatX = randCol;
                        hatY = randRow;
                    }
                    featuresCount++
                }
            }
            newField = new Field(array2D,startingX,startingY,hatX,hatY)
            solveObj = FieldGenerator.isSolvable(newField);
            fieldsGenerated++;
        }while(!solveObj.solvable);

        return newField;
    }

    static isSolvable(field){
        let boolean2DArray = []; 
        field.matrix.forEach((row,i) => {
            let booleanRow = [];
            row.forEach((el,j) => {
                booleanRow.push(el === FEATURE_SYMBOLS.hole); // fill array wtih false, and true if hole/wall ('O') 
            });
            boolean2DArray.push(booleanRow);
        }); 
        return solveMaze(boolean2DArray,field.x,field.y,field.xHat,field.yHat);
    }
}

module.exports = FieldGenerator;