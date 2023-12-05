import fs from "fs";
import path from "path";

const input = fs.readFileSync(path.join(__dirname, 'input.txt')).toString();

const lines = input.split('\n');

const seeds = lines.shift()
    .split(':')
    .at(-1)
    .trim()
    .split(' ')
    .map(Number)


type Concerter = {destinationStart: number, destinationEnd: number, sourceStart: number, sourceEnd: number, count: number}

let maps: {[map: string]: Concerter[]} = {}

let currentMap: string
for (const line of lines) {
    if (line.trim() === '') {
        continue
    }
    if (line.includes('map')) {
        currentMap = line.split(' ')[0]
        continue
    }

    const [destinationRange, sourceRange, count] = line.split(' ').map(Number)

    if (!maps[currentMap]) {
        maps[currentMap] = []
    }

    maps[currentMap].push({
        destinationStart: destinationRange,
        destinationEnd: destinationRange + count,
        sourceStart: sourceRange,
        sourceEnd: sourceRange + count,
        count: count,
    })

}

function sourceToDestination(sourceNumber: number, converters: Concerter[]): number {
    for (const converter of converters) {
        if (sourceNumber >= converter.sourceStart && sourceNumber <= converter.sourceEnd) {
            const diffInCount = sourceNumber - converter.sourceStart
            return converter.destinationStart + diffInCount
        }
    }
    return sourceNumber
}

function computeSeedPosition(seed: number) {
    let seedValue = seed
    for (const [map, converters] of Object.entries(maps)) {
        seedValue = sourceToDestination(seedValue, converters)
    }
    return seedValue
}

let lowestNumber: number
for (const seed of seeds) {
    const seedValue = computeSeedPosition(seed)

    if (!lowestNumber || seedValue <= lowestNumber) {
        lowestNumber = seedValue
    }
}



console.log('Min position:', lowestNumber)
