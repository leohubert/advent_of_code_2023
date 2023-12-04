import path from "path";
import fs from "fs";

const input = fs.readFileSync(path.join(__dirname, 'input.txt')).toString();

let lines = input.split('\n');
lines.pop()


function extractWinners(line: string) {
    const [card, gameLine] = line.split(':')
    const [winingNumbersRaw, myNumbersRaw] = gameLine.split('|')
    const winingNumbers = winingNumbersRaw.trim().split(' ')
    const myNumbers = myNumbersRaw.trim().split(' ')

    const [_, cardNumber] = card.split(' ')

    const mathingNumbers = myNumbers
        .filter(Number)
        .filter(num => winingNumbers.includes(num))

    return {
        mathingNumbers,
        cardNumber: Number(cardNumber)
    }
}

let processedCard = {}

for (const line of lines) {
    const {mathingNumbers, cardNumber} = extractWinners(line)

    if (!processedCard[cardNumber]) {
        processedCard[cardNumber] = 0
    }
    processedCard[cardNumber]++;

    if (mathingNumbers.length) {

        const mulipliyer = processedCard[cardNumber]

        let startingIndex = Number(cardNumber)
        let toIndex = Number(cardNumber) + mathingNumbers.length - 1

        for (let ii = startingIndex; ii <= toIndex; ii++) {
            if (!processedCard[ii + 1]) {
                processedCard[ii + 1] = 0
            }
            processedCard[ii + 1] += 1 * mulipliyer;
        }
    }
}

console.log(processedCard)

// @ts-ignore
console.log(Object.entries(processedCard).reduce((curValue, [_, value]) => {
    return curValue + Number(value)
}, 0))

