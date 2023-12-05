import fs from "fs";
import path from "path";
import _, {map} from "lodash";

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

let lowerstNumber: number
for (const seed of seeds) {
    let seedValue = seed
    console.log('start', seedValue)
    for (const [map, converters] of Object.entries(maps)) {
        seedValue = sourceToDestination(seedValue, converters)
    }
    if (!lowerstNumber || seedValue <= lowerstNumber) {
        lowerstNumber = seedValue
    }
}


console.log(lowerstNumber)

//
// for (const [map, converters] of Object.entries(maps)) {
//     let newNumbers = []
//
//     console.log('map', map)
//
//     for (const seed of seeds) {
//         newNumbers.push(sourceToDestination(seed, converters))
//     }
//
//     console.log(newNumbers)
//
//     numbers = newNumbers
// }


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