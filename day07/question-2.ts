import fs from "fs";
import path from "path";
import _ from "lodash";

const input = fs.readFileSync(path.join(__dirname, 'input.txt')).toString();

const lines = input.split('\n');

const games: {hand: string ,score: number}[] = []
for (const line of lines) {
    const [hand, score] = line.trim().split(' ')
    games.push({
        hand: hand,
        score: Number(score)
    })
}

const cardScore = ['A', 'K', 'Q', 'T', '9', '8', '7', '6', '5', '4', '3', '2', 'J'].reverse()

function scoreCard(card: string) {
    const score = cardScore.findIndex(c => c === card)
    return score
}

function countCard(hand: string, card: string, withJokkers: boolean = false) {
    let occurance = 0

    for (const handCard of Array.from(hand)) {
        if (handCard === card || handCard === 'J') {
            occurance++
        }
    }

    return occurance
}

function scoreHand(hand: string) {
    let score = 0
    const handAsArray = Array.from(hand)
    const remainingHand = _.uniq(handAsArray)
    const jokkerCount = countCard(hand, 'J')
    const hasJokker = jokkerCount > 0

    let bonus = 0

    console.log(remainingHand.length, remainingHand.length  - 1)

    if (remainingHand.length === 1 || (hasJokker && remainingHand.length  - 1 === 1)) {
        // Five of a kind (AAAAA)
        bonus = 100
        console.log('full king')
    } else if (remainingHand.length === 2 || (hasJokker && remainingHand.length - 1 === 2)) {
        const countAA = countCard(hand, remainingHand[0], hasJokker)
        const countBA = countCard(hand, remainingHand[1], hasJokker)
        if (countAA === 4 || countBA === 4) {
            // Four of a kind (ex: AA8AA)
            bonus = 90
            console.log('four king')
        } else {
            // Four of a kind (ex: AA8AA)
            bonus = 80
            console.log('full house')
        }
    } else if (remainingHand.length === 3 || (hasJokker && remainingHand.length - 1 === 3)) {

        const countA = countCard(hand, remainingHand[0], hasJokker)
        const countB = countCard(hand, remainingHand[1], hasJokker)
        const countC = countCard(hand, remainingHand[2], hasJokker)

        if (countA === 3 || countB === 3 || countC === 3) {
            // Three of a kind (ex: AAA98)
            bonus = 70
            console.log('tree of king')
        } else {
            // Two pair (ex: AAKK8)
            bonus = 60
            console.log('Two pair')
        }

    } else if (remainingHand.length === 4 || (hasJokker && remainingHand.length - 1 === 4)) {
        console.log('one pair')
        bonus = 50
    }

    for (const handCard of handAsArray) {
        score += scoreCard(handCard)
    }

    return bonus
}

function fightTwoHand(handA: string, handB: string) {
    const scoreA = scoreHand(handA)
    const scoreB = scoreHand(handB)

    if (scoreA === scoreB) {
        for (let i = 0; i < handA.length; i++) {
            const scoreCardA = scoreCard(handA[i])
            const scoreCardB = scoreCard(handB[i])
            if (scoreCardA !== scoreCardB) {
                return (scoreA + scoreCardA) - (scoreB + scoreCardB)
            }
        }
    }

    return scoreA - scoreB
}

const sortedGame = games
    .sort(((gameA, gameB) => fightTwoHand(gameA.hand, gameB.hand)))

// console.log(sortedGame)


const total =  sortedGame.reduce((value, curValue, index) => {
    return value + (curValue.score * (index + 1))
}, 0)

console.log(`TOTAL: ${total}`)

console.log(scoreHand('KQQJK'))
