import * as fs from "fs";
import * as path from "path";

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
    let skip = false
    for (const party of gameParties) {
        let remainingCubes = {
            red: MAX_CUBES.red,
            green: MAX_CUBES.green,
            blue: MAX_CUBES.blue
        }
        const cubes = party.split(',')
        for (const cube of cubes) {
            const [cubeNumber, cubeColor] = cube.trim().split(' ')
            remainingCubes[cubeColor] -= Number(cubeNumber)
        }
        for (const cube in remainingCubes) {
            const value = remainingCubes[cube]
            if (value < 0) {
                console.log('skip game', gameNumber)
                skip = true
            }
        }
    }

    if (skip) {
        continue
    }

    total += Number(gameNumber)
}

console.log(total)
