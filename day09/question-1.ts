import fs from "fs";
import path from "path";

const input = fs.readFileSync(path.join(__dirname, 'input.txt')).toString();

const lines = input.split('\n');

const gamesLines: number[][] = []

for (const line of lines) {
    gamesLines.push(line.split(' ').filter((c) => c === '0' || Number(c) ).map(Number).reverse())
}

function buildTree(sequence: number[]) {
    const sequences: number[][] = [sequence]

    let i = 0
    while (true) {
        const currentSequence = sequences[i]

        let newSequence: number[] = []
        let isAllZero = true
        for (const [index, nub] of currentSequence.entries()) {
            const nextNumber = currentSequence[index + 1]
            if (nextNumber !== undefined) {
                if (nextNumber < nub) {
                    newSequence.push(-nub - -nextNumber)
                } else {
                    newSequence.push(nextNumber - nub)
                }
            }
            if (nub !== 0 ) {
                isAllZero = false
            }
        }

        if (isAllZero || !newSequence.length) {
            break
        }

        sequences.push(newSequence)
        i++
    }
    return sequences
}

function resolveNextValues(sequence: number[][]) {
    // Add zero to the last sequence
    sequence[sequence.length - 1].push(0)

    for (let i = sequence.length - 2; i >= 0; i--) {
        const currentSequence = sequence[i]
        const nextSequence = sequence[i + 1]

        const lastNumber = currentSequence.at(-1)
        const nextNumber = nextSequence.at(-1)


        sequence[i].push(lastNumber + nextNumber)
    }

    return sequence
}

let total = 0
for (const game of gamesLines) {
    const sequence = buildTree(game)
    const sequenceWithResolvedValues = resolveNextValues(sequence)

    total += sequenceWithResolvedValues[0].at(-1)
}

// console.log(buildTree([2,1,0,-1,-2, -3, 40]))

console.log(total)