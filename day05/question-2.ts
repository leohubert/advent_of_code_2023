import fs from "fs";
import path from "path";
import _, {map} from "lodash";

const input = fs.readFileSync(path.join(__dirname, 'input.txt')).toString();

const lines = input.split('\n');

const seeds = _.chunk(lines.shift()
    .split(':')
    .at(-1)
    .trim()
    .split(' ')
    .map(Number), 2)



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

let lowerstNumber: number
for (const seedRange of seeds) {
    const [seedInital, count] = seedRange
    const seedMax= seedInital + count
    for (let i = seedInital; i <= seedMax ; i++) {
        let seedValue = i
        for (const [map, converters] of Object.entries(maps)) {
            seedValue = sourceToDestination(seedValue, converters)
        }
        if (!lowerstNumber || seedValue <= lowerstNumber) {
            lowerstNumber = seedValue
        }
    }

}

console.log(lowerstNumber)

function sourceToDestination(sourceNumber: number, converters: Concerter[]): number {
    for (const converter of converters) {
        if (sourceNumber >= converter.sourceStart && sourceNumber <= converter.sourceEnd) {
            // console.log(sourceNumber, converter)
            const diffInCount = sourceNumber - converter.sourceStart
            const result = converter.destinationStart + diffInCount
            // console.log({
            //     diffInCount,
            //     result
            // })
            return result
        }
    }
    return sourceNumber
}