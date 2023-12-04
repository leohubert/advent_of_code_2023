import * as fs from "fs";
import * as path from "path";
import {fileURLToPath} from "url";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const MAX_CUBES = {
    red: 12,
    green: 13,
    blue: 14
}

const input = fs.readFileSync(path.join(__dirname, 'input.txt')).toString();

const lines = input.split('\n');

let total=  0
for (const line of lines) {
    const [game, gameLine] = line.split(':')
    const [_, gameNumber] = game.split(' ')
    const gameParties = gameLine.split(';')

    let minimalCubesToPlay = {
        red: 0,
        green: 0,
        blue: 0
    }
    for (const party of gameParties) {
        const cubes = party.split(',')
        for (const cube of cubes) {
            const [cubeNumber, cubeColor] = cube.trim().split(' ')
            if (Number(cubeNumber) > minimalCubesToPlay[cubeColor]) {
                minimalCubesToPlay[cubeColor] = Number(cubeNumber)
            }
        }
    }


    total += minimalCubesToPlay.red * minimalCubesToPlay.green * minimalCubesToPlay.blue
}

console.log(total)
