import fs from "fs";
import path from "path";

const input = fs.readFileSync(path.join(__dirname, 'input.txt')).toString();

const lines = input.split('\n');

const times = lines[0].split(':')[1].split(' ').filter(Number).map(Number)
const distances = lines[1].split(':')[1].split(' ').filter(Number).map(Number)

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

let total: number = 1
for (const [index, time] of times.entries()) {
    const distance =  distances[index]

    console.log(`for ${time} and ${distance}`)
    const possibilities = calculPossibilities(time, distance)

    total *= possibilities

}

console.log('total', total)