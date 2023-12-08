import fs from "fs";
import path from "path";

const input = fs.readFileSync(path.join(__dirname, 'input.txt')).toString();

const lines = input.split('\n');

const instructions = lines.shift().split('')

const map: {[key: string]: [string, string]} = {}

// INI MAP
for (const line of lines) {
    if (line.trim() === '') {
        continue
    }
    const [position, pathsRaw ] = line.split(' = ')
    const [pathL, pathR] = pathsRaw.slice(1, pathsRaw.length - 1).split(',')
    map[position.trim()] = [pathL.trim(), pathR.trim()]
}

// RUN GAME
let currentPosition = 'AAA'

let steps = 0
let instructionIndex = 0
while (true) {
    if (currentPosition === 'ZZZ') {
        break;
    }

    const instruction = instructions[instructionIndex++]
    if (instructionIndex >= instructions.length) {
        instructionIndex = 0
    }
    let nextPosition: string
    if (instruction === 'L') {
        nextPosition = map[currentPosition][0]
    } else {
        nextPosition = map[currentPosition][1]
    }
    currentPosition = nextPosition

    steps++
}

console.log('steps', steps)
