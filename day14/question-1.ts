import fs from "fs";
import path from "path";
import _ from "lodash";

const input = fs.readFileSync(path.join(__dirname, 'input.txt')).toString();

const lines = input.split('\n');

type Position = {
    x: number,
    y: number
}

const board: string[][] = []

for (const line of lines) {
    board.push(Array.from(line))
}

function getPositionValue(position: Position) {
    if (position.y < 0) {
        return '#'
    }
    return board[position.y][position.x]
}

function getNextPosition(position: Position): Position {
    let {x, y} = position
    let value = getPositionValue(position)
    do {
        value = getPositionValue({
            x,
            y: --y
        })
    } while (value === '.')

    return {
        x,
        y: ++y
    }
}

for (let [y, line] of board.entries()) {
    for (let [x, value] of line.entries()) {
        const position: Position = {
            y,
            x
        }

        let value = getPositionValue(position)
        if (value === 'O') {
            const nextPosition = getNextPosition(position)

            if (!_.isEqual(nextPosition, position)) {
                board[y][x] = '.'
                board[nextPosition.y][nextPosition.x] = value
            }
        }

    }
}

let total = 0

for (const [index, line] of board.entries()) {
    const lineCount = board.length - index
    const count0 = line.filter(c => c === 'O').length

    console.log(count0, lineCount)

    total += count0 * lineCount
}

console.log(total)