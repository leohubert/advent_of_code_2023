import fs from "fs";
import path from "path";
import _ from "lodash";

const input = fs.readFileSync(path.join(__dirname, 'input-test.txt')).toString();

const lines = input.split('\n');

type Game = {board: string, numbers: number[]}

const games: Game[] = []

for (const line of lines ) {
    const [board, numbers] = line.split(' ')

    games.push({
        board,
        numbers: numbers.split(',').map(Number)
    })

}

function assertIsPossible(board: string, numbers: number[]) {
    const cleanedBoard= board.replace(/\.+/g, '.');
    const cleanedBoardNumbers = cleanedBoard.split('.').filter(String).map(s => s.length)

    return _.isEqual(cleanedBoardNumbers, numbers)
}

function countArrangements(board: string, numbers: number[], parent: any = null) {
    const boardAsArray = Array.from(board)
    let node = {
        parent,
        current: board,
        children: []
    }
    for (const [index, char] of boardAsArray.entries()) {
        if (char == '?') {
            const withDot = _.cloneDeep(boardAsArray)
            withDot[index] = '.'
            node.children.push(countArrangements(withDot.join(''), numbers, node))


            const withDiaz = _.cloneDeep(boardAsArray)
            withDiaz[index] = '#'
            node.children.push(countArrangements(withDiaz.join(''), numbers, node))
            break
        }
    }

    return node
}

let currentNode= countArrangements('.???...###..', [1, 1, 3])

while (true) {
    console.log(currentNode.current)
    currentNode = currentNode.children
}

console.log(countArrangements('.???...###..', [1, 1, 3]))

//
// for(const game of games) {
//     console.log(game.board, countArrangements(game.board, game.numbers));  // 4
// }

