import fs from "fs";
import path from "path";
import _ from "lodash";

const input = fs.readFileSync(path.join(__dirname, 'input-test.txt')).toString();

const lines = input.split('\n');

type Game = {board: string, numbers: number[]}

const games: Game[] = []

for (const line of lines ) {
    const [board, numbers] = line.split(' ')

    let newNumber = numbers.split(',').map(Number)

    // games.push({
    //     board:[board, board, board, board, board].join('?'),
    //     numbers: [...newNumber, ...newNumber, ...newNumber, ...newNumber, ...newNumber]
    // })

    games.push({
        board,
        numbers: newNumber
    })

}

console.log(games.length)

function assertIsPossible(board: string, numbers: number[]) {
    if (board.indexOf('?') !== -1) {
        return false
    }

    const cleanedBoard= board.replace(/\.+/g, '.');
    const cleanedBoardNumbers = cleanedBoard.split('.').filter(String).map(s => s.length)

    return _.isEqual(cleanedBoardNumbers, numbers)
}

function countArrangements(board: string, numbers: number[]) {
    const boardAsArray = Array.from(board)
    let total = 0
    for (const [index, char] of boardAsArray.entries()) {
        if (char == '?') {
            const withDot = _.cloneDeep(boardAsArray)
            withDot[index] = '.'
            total += countArrangements(withDot.join(''), numbers)


            const withDiaz = _.cloneDeep(boardAsArray)
            withDiaz[index] = '#'
            total += countArrangements(withDiaz.join(''), numbers)
            break
        }
    }


    if (assertIsPossible(board, numbers)) {
        return total + 1
    }

    return total
}

let total = 0
for(const game of games) {
    console.time(`staring-${game.board}`)
    // console.log(game.board, countArrangements(game.board, game.numbers));  // 4
     total += countArrangements(game.board, game.numbers)

    console.timeEnd(`staring-${game.board}`)
    // break
}


console.log(total)
