import fs from "fs";
import path from "path";

const input = fs.readFileSync(path.join(__dirname, 'input.txt')).toString();

const lines = input.split('\n');
let emptyLineY: number[] = []
let emptyLineX: number[] = []

let universeExpansion= 1000000 - 1

function isEmptyY(y: number) {
    const line = Array.from(lines[y])

    for (const char of line) {
        if (char !== '.') {
            return false
        }
    }

    return true
}

function isEmptyX(x: number) {
    for (let i = 0; i < lines.length; i++) {
        if (Array.from(lines[i])[x] !== '.') {
            return false
        }
    }
    return true
}

// Checking X lines
for (const [x, _] of Array.from(lines[0]).entries()) {
    if (isEmptyX(x)) {
        emptyLineY.push(x)
    }
}

// Checking Y lines
for (const y of lines.keys()) {
    if (isEmptyY(y)) {
        emptyLineX.push(y)
    }
}


const universe: string[] = []

let galaxyPositions:{[galaxy: number]: [number, number]} = {}
let galaxyCounter = 1
for (const [y, line] of lines.entries()) {
    const lineAsArray = line.split('')

    for (const [x, char] of lineAsArray.entries()) {
        if (char === '#') {
            galaxyPositions[galaxyCounter] = [x, y]
            lineAsArray[x] = `${galaxyCounter++}`
        }
    }

    universe.push(lineAsArray.join(''))
}

function calculDistance(fromGalaxy: number, toGalaxy: number) {
    const galaxy1Position = galaxyPositions[fromGalaxy]
    const galaxy2Position = galaxyPositions[toGalaxy]

    const [x1, y1] = galaxy1Position
    const [x2, y2] = galaxy2Position

    const yEmptyThrow = emptyLineX.filter(y => y1 < y2 ? y1 < y && y2 > y : y1 > y && y2 < y)
    const xEmptyThrow = emptyLineY.filter(x => x1 < x2 ? x1 < x && x2 > x : x1 > x && x2 < x)

    let diffX = Math.abs(x2 - x1) + (xEmptyThrow.length * universeExpansion)
    let diffY = Math.abs(y2 - y1) + (yEmptyThrow.length * universeExpansion)

    return diffX + diffY
}
console.log(emptyLineX, emptyLineY)

console.log(universe.join('\n'))
console.log(galaxyPositions)

console.log(calculDistance(1, 7))

let total = 0
for (let currentGalaxy = 1; currentGalaxy < galaxyCounter; currentGalaxy++) {
    for (let galaxyToCheck = currentGalaxy + 1; galaxyToCheck < galaxyCounter; galaxyToCheck++) {
        console.log(currentGalaxy, galaxyToCheck)
        total += calculDistance(currentGalaxy, galaxyToCheck)
    }
}

console.log(total)