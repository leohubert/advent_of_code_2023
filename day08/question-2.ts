import fs from "fs";
import path from "path";
import _ from "lodash";

const input = fs.readFileSync(path.join(__dirname, 'input.txt')).toString();

const lines = input.split('\n');

const instructions = lines.shift().split('')

const map: {[key: string]: [string, string]} = {}

let firstMapPosition = null

// INI MAP
for (const line of lines) {
    if (line.trim() === '') {
        continue
    }
    const [position, pathsRaw ] = line.split(' = ')
    const [pathL, pathR] = pathsRaw.slice(1, pathsRaw.length - 1).split(',')
    map[position.trim()] = [pathL.trim(), pathR.trim()]

    if (!firstMapPosition) {
        firstMapPosition = position
    }
}

// RUN GAME

const startingPaths = Object.keys(map).filter(position => position.endsWith('A'))
console.log(startingPaths)

let currentPositions = [startingPaths[0], startingPaths[1], startingPaths[2], startingPaths[3]]
let steps = 0
let instructionIndex = 0
while (true) {
    if (_.every(currentPositions, path => path.endsWith('Z') )) {
        break;
    }

    const instruction = instructions[instructionIndex++]
    if (instructionIndex >= instructions.length) {
        instructionIndex = 0
    }
    for (const [index, currentPosition] of currentPositions.entries()) {
        let nextPosition: string
        if (instruction === 'L') {
            nextPosition = map[currentPosition][0]
        } else {
            nextPosition = map[currentPosition][1]
        }
        currentPositions[index] = nextPosition
    }

    steps++
}


console.log(steps)

