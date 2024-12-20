import fs from "fs";
import path from "path";

const input = fs.readFileSync(path.join(__dirname, 'input.txt')).toString();

const lines = input.split('\n');

const boards: {
    board: string[]
}[] = []

let currentBoard: string[] = []
for (const line of lines) {
    if (line === '') {
        boards.push({
            board: currentBoard
        })
        currentBoard = []
        continue
    }

    currentBoard.push(line)
}
boards.push({
    board: currentBoard
})

function countMirrorSize(board: string[], position: {position: number, axis: string}) {
    if (position.axis === 'y') {
        let mirrorYAPosition = position.position
        let mirrorYBPosition = position.position + 1

        while (true) {
            if (mirrorYAPosition < 0 || mirrorYBPosition >= board.length) {
                break
            }
            const mirrorA = board[mirrorYAPosition]
            const mirrorB = board[mirrorYBPosition]


            if (mirrorA === mirrorB) {
                mirrorYAPosition--;
                mirrorYBPosition++;
            } else {
             break
            }
        }

        // if (mirrorYAPosition + 1 === position.position && mirrorYBPosition - 1 ===  position.position + 1) {
        //     return false
        // }


        return [mirrorYAPosition + 1, mirrorYBPosition - 1]
    } else {
        let mirrorXAPosition = position.position
        let mirrorXBPosition = position.position + 1

        while (true) {
            if (mirrorXAPosition < 0 || mirrorXBPosition >= board[0].length) {
                break
            }
            let mirrorA = ''
            for (const YLine of board) {
                mirrorA = `${mirrorA}${Array.from(YLine[mirrorXAPosition])}`
            }

            let mirrorB = ''
            for (const YLine of board) {
                mirrorB = `${mirrorB}${Array.from(YLine[mirrorXBPosition])}`
            }


            if (mirrorA === mirrorB) {
                mirrorXAPosition--;
                mirrorXBPosition++;
            } else {
                break
            }
        }

        // if (mirrorXAPosition + 1 === position.position && mirrorXBPosition - 1 ===  position.position + 1) {
        //     return false
        // }

        return [mirrorXAPosition + 1, mirrorXBPosition - 1]

    }
}

function findMirrorPosition(board: string[]) {

    let yPosition = null
    // findind Y
    let prevYLine: string = null
    for (const [y, line] of board.entries()) {
        if (prevYLine && line === prevYLine) {
            const mirrorSize = countMirrorSize(board, {
                position: y - 1,
                axis: 'y'
            })
            if (mirrorSize[0] === 0 || mirrorSize[1] === board.length - 1) {
                yPosition = {
                    position: y,
                    size: mirrorSize,
                    axis: 'y'
                }
            }

        } else {
            prevYLine = line
        }

    }

    // findind X
    let xPosition = null
    let prevXLine: string = null
    for (let x = 0; x < board[0].length; x++) {
        let line = ''
        for (const [y, YLine] of board.entries()) {
            line = `${line}${Array.from(YLine[x])}`
        }
        if (prevXLine && line === prevXLine) {
            const mirrorSize = countMirrorSize(board, {
                position: x - 1,
                axis: 'x'
            })
            if (mirrorSize[0] === 0 || mirrorSize[1] === board[0].length - 1) {
                xPosition = {
                    position: x ,
                    size: mirrorSize,
                    axis: 'x'
                }
            }
        } else {
            prevXLine = line
        }
    }

    if (yPosition && xPosition) {
        console.log(yPosition, xPosition)
        console.log(yPosition.size[0], yPosition.size[1], board.length - 1)
        if (yPosition.size[0] === 0 || yPosition.size[1] === board.length - 1) {
            console.log('choose ==> y')
            return yPosition
        } else {
            console.log('choose ==> x')
            return xPosition
        }
    } else if (yPosition) {
        return yPosition
    } else if (xPosition) {
        return xPosition
    }
}

let xAxis = 0
let yAxis = 0

for (const board of boards) {
    const position = findMirrorPosition(board.board)

    if (position.axis === 'x') {
        xAxis += position.position
    } else {
        yAxis += position.position
    }
}

console.log((yAxis * 100) + xAxis)

