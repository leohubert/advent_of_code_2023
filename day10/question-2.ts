import fs from "fs";
import path from "path";
import _ from "lodash";
import * as turf from "@turf/turf";

const input = fs.readFileSync(path.join(__dirname, 'input.txt')).toString();

const maze = input.split('\n');
const emptyMaze = maze.map(line => line.replace(/[^ ]/g, '.'))


type Position = { x: number, y: number }

enum Direction {
    UP = '|',
    DOWN = '|',
    LEFT = '-',
    RIGHT = '-',
    RIGHT_TO_UP = 'J',
    DOWN_TO_LEFT = 'J',
    RIGHT_TO_DOWN = '7',
    UP_TO_LEFT = '7',
    DOWN_TO_RIGHT = 'L',
    LEFT_TO_UP = 'L',
    UP_TO_RIGHT = 'F',
    LEFT_TO_DOWN = 'F',
}

let initialPosition = {
    x: 0,
    y: 0
}
let mazeMaxX = maze[0].length - 1
let mazeMaxY = maze.length - 1

for (const [y, line] of maze.entries()) {
    const x = line.indexOf('S')
    if (x !== -1) {
        initialPosition = {
            x: x,
            y: y
        }
        break
    }
}


function moveTo(startingPosition: Position, direction: Direction): Position {
    let newPosition = _.cloneDeep(startingPosition)

    switch (direction as string) {
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

function getPositionValue(position: Position): Direction {
    return maze[position.y][position.x] as Direction
}

let polygonPoints = []

let move = 0
let currentPosition = initialPosition
let lastPosition: Position | null = null

while (true) {
    const currentPositionValue = getPositionValue(currentPosition) as Direction | string
    if (currentPositionValue === 'S' || [Direction.UP_TO_LEFT, Direction.UP_TO_RIGHT, Direction.DOWN_TO_LEFT, Direction.DOWN_TO_RIGHT, Direction.RIGHT_TO_UP, Direction.RIGHT_TO_DOWN, Direction.LEFT_TO_UP, Direction.LEFT_TO_DOWN].includes(currentPositionValue as Direction)) {
        polygonPoints.push([currentPosition.x, currentPosition.y])
    }


    console.log(currentPosition, currentPositionValue, move)
    if (currentPositionValue === 'S' && move !== 0) {
        console.log('FOUND', move / 2)
        break
    }

    const mazeLine = Array.from(emptyMaze[currentPosition.y])
    mazeLine[currentPosition.x] = 'X'
    emptyMaze[currentPosition.y] = mazeLine.join('')

    const safeUp = currentPosition.y > 0 ? currentPosition.y - 1 : null
    const safeRight = currentPosition.x < mazeMaxX ? currentPosition.x + 1 : null
    const safeDown = currentPosition.y < mazeMaxY ? currentPosition.y + 1 : null
    const safeLeft = currentPosition.x > 0 ? currentPosition.x - 1 : null

    const upPosition = safeUp !== null ? {x: currentPosition.x, y: safeUp} : null
    const rightPosition = safeRight !== null ? {x: safeRight, y: currentPosition.y} : null
    const downPosition = safeDown !== null ? {x: currentPosition.x, y: safeDown} : null
    const leftPosition = safeLeft !== null ? {x: safeLeft, y: currentPosition.y} : null

    const upValue = upPosition !== null ? getPositionValue(upPosition) : null
    const rightValue = rightPosition !== null ? getPositionValue(rightPosition) : null
    const downValue = downPosition !== null ? getPositionValue(downPosition) : null
    const leftValue = leftPosition !== null ? getPositionValue(leftPosition) : null

    if (currentPositionValue === 'S' && move === 0) {
        if (
            [Direction.UP, Direction.UP_TO_LEFT, Direction.UP_TO_RIGHT].includes(upValue as Direction)
        ) {
            lastPosition = currentPosition
            currentPosition = moveTo(currentPosition, Direction.UP)
        } else if (
            [Direction.RIGHT, Direction.RIGHT_TO_UP, Direction.RIGHT_TO_DOWN].includes(rightValue as Direction)
        ) {
            lastPosition = currentPosition
            currentPosition = moveTo(currentPosition, Direction.RIGHT)
        } else if (
            [Direction.DOWN, Direction.DOWN_TO_LEFT, Direction.DOWN_TO_RIGHT].includes(downValue as Direction)
        ) {
            lastPosition = currentPosition
            currentPosition = moveTo(currentPosition, Direction.DOWN)
        } else if (
            [Direction.LEFT, Direction.LEFT_TO_UP, Direction.LEFT_TO_DOWN].includes(leftValue as Direction)
        ) {
            lastPosition = currentPosition
            currentPosition = moveTo(currentPosition, Direction.LEFT)
        }
    } else {
        if (currentPositionValue === Direction.UP && !_.isEqual(upPosition, lastPosition)) {
            console.log('UP')
            lastPosition = currentPosition
            currentPosition = upPosition
        } else if (currentPositionValue === Direction.RIGHT && !_.isEqual(rightPosition, lastPosition)) {
            console.log('RIGHT')
            lastPosition = currentPosition
            currentPosition = rightPosition
        } else if (currentPositionValue === Direction.DOWN && !_.isEqual(downPosition, lastPosition)) {
            console.log('DOWN')
            lastPosition = currentPosition
            currentPosition = downPosition
        } else if (currentPositionValue === Direction.LEFT && !_.isEqual(leftPosition, lastPosition)) {
            console.log('LEFT')
            lastPosition = currentPosition
            currentPosition = leftPosition
        } else if (currentPositionValue === Direction.UP_TO_LEFT && !_.isEqual(leftPosition, lastPosition)) {
            console.log('UP_TO_LEFT')
            lastPosition = currentPosition
            currentPosition = leftPosition
        } else if (currentPositionValue === Direction.UP_TO_RIGHT && !_.isEqual(rightPosition, lastPosition)) {
            console.log('UP_TO_RIGHT')
            lastPosition = currentPosition
            currentPosition = rightPosition
        } else if (currentPositionValue === Direction.DOWN_TO_LEFT && !_.isEqual(leftPosition, lastPosition)) {
            console.log('DOWN_TO_LEFT')
            lastPosition = currentPosition
            currentPosition = leftPosition
        } else if (currentPositionValue === Direction.DOWN_TO_RIGHT && !_.isEqual(rightPosition, lastPosition)) {
            console.log('DOWN_TO_RIGHT')
            lastPosition = currentPosition
            currentPosition = rightPosition
        } else if (currentPositionValue === Direction.RIGHT_TO_UP && !_.isEqual(upPosition, lastPosition)) {
            console.log('RIGHT_TO_UP')
            lastPosition = currentPosition
            currentPosition = upPosition
        } else if (currentPositionValue === Direction.RIGHT_TO_DOWN && !_.isEqual(downPosition, lastPosition)) {
            console.log('RIGHT_TO_DOWN')
            lastPosition = currentPosition
            currentPosition = downPosition
        } else if (currentPositionValue === Direction.LEFT_TO_UP && !_.isEqual(upPosition, lastPosition)) {
            console.log('LEFT_TO_UP')
            lastPosition = currentPosition
            currentPosition = upPosition
        } else if (currentPositionValue === Direction.LEFT_TO_DOWN && !_.isEqual(downPosition, lastPosition)) {
            console.log('LEFT_TO_DOWN')
            lastPosition = currentPosition
            currentPosition = downPosition
        } else {
            console.log('NOT FOUND')
            break
        }
    }
    move++
}

console.log(polygonPoints)
const poly = turf.polygon([polygonPoints]);


let count = 0
function replaceInArea(area: string[]): string[] {
    for (const [y, line] of area.entries()) {
        let isInArea = false
        for (const [x, char] of line.split('').entries()) {
            if (char !== 'X' && turf.booleanPointInPolygon([x, y], poly)) {
                area[y] = area[y].substr(0, x) + 'I' + area[y].substr(x + 1)
                count++
                isInArea = true
            }
        }
    }
    return area
}

console.log(polygonPoints)

const newMaze = replaceInArea(emptyMaze)

console.log(newMaze.join('\n'))

console.log(count)
