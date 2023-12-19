import fs from "fs";
import path from "path";

const input = fs.readFileSync(path.join(__dirname, 'input.txt')).toString();

const lines = input.split('\n');

const positions: number[][] = [[0, 0]]
let currentPosition = [0, 0]

let borderLenght = 0
for (const line of lines) {
    const [_, __, colorRaw] = line.split(' ')
    const cleanedColorRaw = colorRaw.replace('(', '').replace(')', '')
    const direction = cleanedColorRaw.at(-1)
    const length = parseInt(cleanedColorRaw.slice(1, -1), 16)

    const size = Number(length)

    borderLenght += size

    if (direction === '0') {
        currentPosition = [currentPosition[0], currentPosition[1] + size]
    } else if (direction === '1') {
        currentPosition = [currentPosition[0] + size, currentPosition[1]]
    } else if (direction === '2') {
        currentPosition = [currentPosition[0], currentPosition[1] - size]
    } else if (direction === '3') {
        currentPosition = [currentPosition[0] - size, currentPosition[1]]
    }

    positions.push(currentPosition)
}

function calculateArea(coords: number[][]) {
    let area = 0;

    for (let i = 0; i < coords.length; i++) {
        const [x1, y1] = coords[i];
        const [x2, y2] = coords[(i + 1) % coords.length];

        area += x1 * y2 - x2 * y1
    }

    return Math.abs(area) / 2;
}

console.log(Math.abs(calculateArea(positions) +( borderLenght / 2 + 1)))