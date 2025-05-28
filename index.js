const Game = require("./models/Game.js");
const FieldGenerator = require("./utils/fieldGenerator.js")

function main(){
    const field = FieldGenerator.generateField(25,50,0.4);
    const game = new Game(field);

    if(process.argv[2] === 'solution=true' || process.argv[2] === 'true'){
        game.run(true); // run with path solution visible
    } else { 
        game.run(false);
    }
}

main();