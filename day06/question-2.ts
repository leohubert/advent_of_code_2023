import fs from "fs";
import path from "path";

const input = fs.readFileSync(path.join(__dirname, 'input.txt')).toString();

const lines = input.split('\n');

const time = Number(lines[0].replaceAll(' ', '').split(':')[1].trim())
const distance = Number(lines[1].replaceAll(' ', '').split(':')[1].trim())

function calculPossibilities(time: number, distance: number): number {
    let win = 0
    for (let i = 1; i < time; i++) {
        const remainingTime = time - i
        const iterateDistance = i * remainingTime
        if (iterateDistance > distance) {
            win++
        }
    }
    return win
}

const total = calculPossibilities(time, distance)

console.log('total', total)