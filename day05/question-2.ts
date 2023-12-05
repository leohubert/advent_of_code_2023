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
    .sort((a, b) => a[0] - b[0])

type Concerter = {destinationStart: number, destinationEnd: number, sourceStart: number, sourceEnd: number}

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

const seedsToSoil = maps['seed-to-soil']
    // sort by lower sourceStart to optimize the code
    .sort((a, b) => a.sourceStart - b.sourceStart)

let lowerstNumber: number
for (const seedRange of seeds) {
    let [seedInitialValue, range] = seedRange
    const minSeedValue = seedInitialValue
    const maxSeedValue = seedInitialValue + range

    for (const seedToSoil of seedsToSoil) {
        const overlap = Math.min(seedToSoil.sourceEnd, maxSeedValue) - Math.max(seedToSoil.sourceStart, minSeedValue)
        if (overlap > 0) {
            let overLapStart = minSeedValue >= seedToSoil.sourceStart ? minSeedValue : seedToSoil.sourceStart;
            let overLapEnd = maxSeedValue <= seedToSoil.sourceEnd ? maxSeedValue : seedToSoil.sourceEnd;

            console.log(`Testing ${overLapStart} to ${overLapEnd}`)

            for(let seed = overLapStart; seed <= overLapEnd; seed++) {
                const seedValue = computeSeedPosition(seed)
                if(!lowerstNumber || seedValue < lowerstNumber) {
                    lowerstNumber = seedValue;
                }
            }

            // because seedsToSoil are sorted by lowest values before,
            // we can stop the code for this seed
            break;
        }
    }

}

console.log('Min position: ', lowerstNumber)
