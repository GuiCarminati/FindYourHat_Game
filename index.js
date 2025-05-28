const Game = require("./models/Game.js");
const FieldGenerator = require("./utils/fieldGenerator.js")

function main(){
    const field = FieldGenerator.generateField(25,50,0.4);
    const game = new Game(field);

    game.run();

}

main();