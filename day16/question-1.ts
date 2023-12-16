import fs from "fs";
import path from "path";
import _ from "lodash";

const input = fs.readFileSync(path.join(__dirname, 'input.txt')).toString();

const lines = input.split('\n');

const board: string[][] = []

for (const line of lines) {
    board.push(Array.from(line))
}

enum Direction {
    UP,
    DOWN,
    LEFT,
    RIGHT,
}

type Position = { x: number, y: number }

function moveTo(startingPosition: Position, direction: Direction): Position {
    let newPosition = _.cloneDeep(startingPosition)

    switch (direction) {
        case Direction.UP:
            newPosition.y--
            break
        case Direction.DOWN:
            newPosition.y++
            break
        case Direction.RIGHT:
            newPosition.x++;
            break
        case Direction.LEFT:
            newPosition.x--;
            break
    }

    return newPosition
}

function getPositionValue({x, y}: Position) {
    if (y < 0 || y >= board.length || x < 0 || x >= board[0].length) {
        return null
    }
    return board[y][x]
}

function setPositionValue({x, y}: Position, value: string) {
    board[y][x] = value
}

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

function printBoard(cleaned?: boolean) {
    const finalBoard = _.cloneDeep(board)

    if (cleaned) {
        for (const position of positionToChange) {
            finalBoard[position.y][position.x] = '#'
        }
    }

    console.log(finalBoard.map(line => line.join('')).join('\n'))
}

function computeTotal() {
    const finalBoard = _.cloneDeep(board)
    for (const position of positionToChange) {
        finalBoard[position.y][position.x] = '#'
    }


    return finalBoard.map(line => line.filter(c => c === '#')).reduce((curValue, value) => {
        return curValue + value.filter(c => c === '#').length
    }, 0)
}

const positionToChange: Position[] = []
const mirrorPositionCount: {[xy: string]: number} = {}

async function moveUntilNextMirror(initialPosition: Position, direction: Direction) {
    let position = _.cloneDeep(initialPosition)

    const positionString = `${position.y}-${position.x}-${direction}`
    if (!mirrorPositionCount[positionString]) {
        mirrorPositionCount[positionString] = 1
    } else {
        return
    }

    let currentValue = getPositionValue(position)
    while (currentValue === '.' || currentValue === '#') {
        setPositionValue(position, '#')

        position = moveTo(position, direction)
        currentValue = getPositionValue(position)
    }

    if (currentValue === null) {
        return
    }

    if (currentValue === '|') {
        positionToChange.push(position)
        if (direction === Direction.UP) {
            await moveUntilNextMirror(moveTo(position, Direction.UP), Direction.UP)
        } else if (direction === Direction.DOWN) {
            await moveUntilNextMirror(moveTo(position, Direction.DOWN), Direction.DOWN)
        } else  {
            await moveUntilNextMirror(moveTo(position, Direction.UP), Direction.UP)
            await moveUntilNextMirror(moveTo(position, Direction.DOWN), Direction.DOWN)
        }
    }
    else if (currentValue === '-') {
        positionToChange.push(position)

        if (direction === Direction.RIGHT) {
            await moveUntilNextMirror(moveTo(position, Direction.RIGHT), Direction.RIGHT)
        } else if (direction === Direction.LEFT) {
            await moveUntilNextMirror(moveTo(position, Direction.LEFT), Direction.LEFT)
        } else  {
            await moveUntilNextMirror(moveTo(position, Direction.RIGHT), Direction.RIGHT)
            await moveUntilNextMirror(moveTo(position, Direction.LEFT), Direction.LEFT)
        }
    } else if (currentValue === '/') {
        positionToChange.push(position)
        let nextDirection: Direction
        switch (direction) {
            case Direction.UP:
                nextDirection = Direction.RIGHT
                break
            case Direction.DOWN:
                nextDirection = Direction.LEFT
                break
            case Direction.RIGHT:
                nextDirection = Direction.UP
                break
            case Direction.LEFT:
                nextDirection = Direction.DOWN
                break
        }
        await moveUntilNextMirror(moveTo(position, nextDirection), nextDirection)
    } else if (currentValue === '\\') {
        positionToChange.push(position)
        let nextDirection: Direction
        switch (direction) {
            case Direction.UP:
                nextDirection = Direction.LEFT
                break
            case Direction.DOWN:
                nextDirection = Direction.RIGHT
                break
            case Direction.RIGHT:
                nextDirection = Direction.DOWN
                break
            case Direction.LEFT:
                nextDirection = Direction.UP
                break
        }
        await moveUntilNextMirror(moveTo(position, nextDirection), nextDirection)
    }
}


moveUntilNextMirror({
    x: 0,
    y: 0
}, Direction.RIGHT).then(() => {
    printBoard(true)
    console.log('done', computeTotal())
}).catch((err) => {
    console.log('error', err)
})




