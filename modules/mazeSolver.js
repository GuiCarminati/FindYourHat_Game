


function solveMaze(maze, startX=0, startY=0, endX=2, endY=2){ 
    // Adapted from: https://en.wikipedia.org/wiki/Maze-solving_algorithm#Recursive_algorithm
    // expects maze to be a boolean 2D matrix, where path=false, wall=true
    const numRows = maze.length;
    const numCols = maze[0].length;
    let wasHere = filled2DArray(numRows, numCols, false);
    let correctPath = filled2DArray(numRows, numCols, false);

    function recursiveSolve(x, y){
        if(x === endX && y === endY) return true; // if reached the end
        if(maze[y][x] || wasHere[y][x]) return false; // if wall OR was already here
        wasHere[y][x] = true; 


        if (x != 0){ // Checks if not on left edge
            if (recursiveSolve(x-1, y)) { // Recalls method one to the left
                correctPath[y][x] = true; // Sets that path value to true;
                return true;
            }
        }
        if (x != numCols - 1) // Checks if not on right edge
            if (recursiveSolve(x+1, y)) { // Recalls method one to the right
                correctPath[y][x] = true;
                return true;
            }
        if (y != 0)  // Checks if not on top edge
            if (recursiveSolve(x, y-1)) { // Recalls method one up
                correctPath[y][x] = true;
                return true;
            }
        if (y != numRows - 1) // Checks if not on bottom edge
            if (recursiveSolve(x, y+1)) { // Recalls method one down
                correctPath[y][x] = true;
                return true;
            }
        return false;

    }

    const solvable = recursiveSolve(startX,startY); //  If false, there is no solution to the maze

    return { solvable, correctPath }

}


function filled2DArray(numRows, numCols, value=0){
    return new Array(numRows).fill().map(() => new Array(numCols).fill(value))
}


function tests(){
    const testMaze = [
        [0,1,0,0,0,0,0,0],
        [0,1,0,1,1,0,0,0],
        [0,1,0,1,1,1,1,0],
        [0,0,0,1,1,0,0,0],
        [1,0,0,1,0,0,0,1],
        [0,0,0,0,0,0,1,0],
    ];
    
    const printSolvePath = (solveArray,path='░',wall='O') => {
        solveArray.forEach(row => {
            let lineStr = "";
            row.forEach(el => {
                lineStr+=(el ? wall : path)
            });
            console.log(lineStr)
        }); 

    }

    const solveObj = solveMaze(testMaze,0,0,6,5);

    printSolvePath(testMaze)
    console.log('')

    console.table('is solvable: '+solveObj.solvable);
    if(solveObj.solvable) printSolvePath(solveObj.correctPath,'O','*');

    // const booleanArray = new Array(testMaze.length); // [[],[],[]] 

    // console.log(booleanArray)

    
}


// tests();

module.exports = { solveMaze };
