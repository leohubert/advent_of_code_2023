import fs from "fs";
import path from "path";
import * as math from 'mathjs'

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
const startingPaths = Object.keys(map).filter(position => position.endsWith('A'))

function calculSteps(startingPostion: string) {
    let currentPosition = startingPostion
    let steps = 0
    let instructionIndex = 0
    while (true) {
        if (currentPosition.endsWith('Z')) {
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
    return steps
}

let stepsForPaths = startingPaths.map(calculSteps)
// @ts-ignore
const steps = math.lcm(...stepsForPaths)

console.log('steps', steps)


