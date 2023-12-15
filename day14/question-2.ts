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
    if (position.y < 0 || position.y >= board.length || position.x < 0 || position.x >= board[0].length) {
        return '#'
    }
    return board[position.y][position.x]
}

function getNextPosition(position: Position, direction: Direction): Position {
    let value = getPositionValue(position)

    let prevPosition: Position = position
    while (true) {
        const newPosision = Directions[direction](prevPosition)
        value = getPositionValue(newPosision)
        if (value !== '.') {
            return prevPosition
        }
        prevPosition = newPosision
    }
}

let cycles = 1000000000

enum Direction {
    NORTH,
    WEST,
    SOUTH,
    EAST
}

const Directions = {
    [Direction.NORTH]: (position) => ({
        x: position.x,
        y: position.y - 1
    }),
    [Direction.WEST]: (position) => ({
        x: position.x - 1,
        y: position.y
    }),
    [Direction.SOUTH]: (position) => ({
        x: position.x,
        y: position.y + 1
    }),
    [Direction.EAST]: (position) => ({
        x: position.x + 1,
        y: position.y
    })
}

function rotatePlatform(direction: Direction) {
    if (direction === Direction.NORTH) {
        for (let [y, line] of board.entries()) {
            for (let [x, value] of line.entries()) {
                const position: Position = {
                    y,
                    x
                }

                let value = getPositionValue(position)
                if (value === 'O') {
                    const nextPosition = getNextPosition(position, direction)

                    if (!_.isEqual(nextPosition, position)) {
                        board[y][x] = '.'
                        board[nextPosition.y][nextPosition.x] = value
                    }
                }

            }
        }
    } else if (direction === Direction.WEST) {
        for (let x = 0; x < board[0].length; x++) {
            for (let y = 0; y < board.length; y++) {
                const position: Position = {
                    y,
                    x
                }

                let value = getPositionValue(position)
                if (value === 'O') {
                    const nextPosition = getNextPosition(position, direction)

                    if (!_.isEqual(nextPosition, position)) {
                        board[y][x] = '.'
                        board[nextPosition.y][nextPosition.x] = value
                    }
                }
            }
        }
    } else if (direction === Direction.SOUTH) {
        for (let y = board.length - 1; y >= 0; y--) {
            for (let x = 0; x < board[0].length; x++) {
                const position: Position = {
                    y,
                    x
                }

                let value = getPositionValue(position)
                if (value === 'O') {
                    const nextPosition = getNextPosition(position, direction)

                    if (!_.isEqual(nextPosition, position)) {
                        board[y][x] = '.'
                        board[nextPosition.y][nextPosition.x] = value
                    }
                }
            }
        }
    } else if (direction === Direction.EAST) {
        for (let x = board[0].length - 1; x >= 0; x--) {
            for (let y = 0; y < board.length; y++) {
                const position: Position = {
                    y,
                    x
                }

                let value = getPositionValue(position)
                if (value === 'O') {
                    const nextPosition = getNextPosition(position, direction)

                    if (!_.isEqual(nextPosition, position)) {
                        board[y][x] = '.'
                        board[nextPosition.y][nextPosition.x] = value
                    }
                }
            }
        }
    }
}

// rotatePlatform(Direction.EAST)
// printBoard()
// console.log('cc')
// rotatePlatform(Direction.SOUTH)
// printBoard()
// calculTotal()


let direction = Direction.NORTH
let cycle = 0
while (cycle < cycles) {

    if (direction === Direction.NORTH && cycle % 100000 === 0) {
        calculTotal()
    }

    rotatePlatform(direction)
    cycle++
    switch (direction) {
        case Direction.NORTH:
            direction = Direction.WEST
            break;
        case Direction.WEST:
            direction = Direction.SOUTH
            break
        case Direction.SOUTH:
            direction = Direction.EAST
            break
        case Direction.EAST:
            direction = Direction.NORTH
            break
    }
}

function printBoard() {
    console.log(board.map(line => line.join('')).join('\n'))
}


function calculTotal() {
    let total = 0

    for (const [index, line] of board.entries()) {
        const lineCount = board.length - index
        const count0 = line.filter(c => c === 'O').length

        total += count0 * lineCount
    }
    console.log(total)
}


printBoard()
calculTotal()