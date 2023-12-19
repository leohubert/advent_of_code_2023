import fs from "fs";
import path from "path";

const input = fs.readFileSync(path.join(__dirname, 'input.txt')).toString();

const lines = input.split('\n');

const positions: number[][] = [[0, 0]]
let currentPosition = [0, 0]

let borderLenght = 0
for (const line of lines) {
    const [direction, length, colorRaw] = line.split(' ')
    const size = Number(length)

    borderLenght += size

    if (direction === 'R') {
        currentPosition = [currentPosition[0], currentPosition[1] + size]
    } else if (direction === 'D') {
        currentPosition = [currentPosition[0] + size, currentPosition[1]]
    } else if (direction === 'L') {
        currentPosition = [currentPosition[0], currentPosition[1] - size]
    } else if (direction === 'U') {
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

console.log(calculateArea(positions) +( borderLenght / 2 + 1))