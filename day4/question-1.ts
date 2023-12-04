import {fileURLToPath} from "url";
import path from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const input = fs.readFileSync(path.join(__dirname, 'input.txt')).toString();

const lines = input.split('\n');
lines.pop()

let total = 0
for (const line of lines) {
    const [card, gameLine] = line.split(':')
    const [winingNumbersRaw, myNumbersRaw] = gameLine.split('|')
    const winingNumbers = winingNumbersRaw.trim().split(' ')
    const myNumbers = myNumbersRaw.trim().split(' ')


    const mathingNumbers = myNumbers
        .filter(Number)
        .filter(num => winingNumbers.includes(num))

    if (mathingNumbers.length) {
        total += mathingNumbers.reduce((previousValue, currentValue, currentIndex) => {
            if (currentIndex === 0) {
                return previousValue
            }
            return previousValue * 2
        }, 1)
    }

    console.log(mathingNumbers)

}

console.log(total)
