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

const cardScore = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'].reverse()

function scoreCard(card: string) {
    const score = cardScore.findIndex(c => c === card)
    return score
}

function countCard(hand: string, card: string) {
    let occurance = 0

    for (const handCard of Array.from(hand)) {
        if (handCard === card) {
            occurance++
        }
    }

    return occurance
}

function scoreHand(hand: string) {
    let score = 0
    const handAsArray = Array.from(hand)
    const remainingHand = _.uniq(handAsArray)

    let bonus = 0

    if (remainingHand.length === 1) {
        // Five of a kind (AAAAA)
        bonus = 100
        console.log('full king')
    } else if (remainingHand.length === 2) {
       const countA = countCard(hand, remainingHand[0])
        const countB = countCard(hand, remainingHand[1])
        if (countA === 3 && countB === 2 || countA === 2 && countB === 3) {
            // Full house (ex: 23332)
            bonus = 80
            console.log('full house')
        } else {
            // Four of a kind (ex: AA8AA)
            bonus = 90
            console.log('four king')
        }
    } else if (remainingHand.length === 3) {

        const countA = countCard(hand, remainingHand[0])
        const countB = countCard(hand, remainingHand[1])
        const countC = countCard(hand, remainingHand[2])

        if (countA === 2 && (countB === 2 || countC === 2)
            || countB === 2 && (countA === 2 || countC === 2)
            || countC === 2 && (countA === 2 || countB === 2)) {
            console.log('Two pair')
            bonus = 60
        } else {
            // Tree of king ex TTT98
            bonus = 70
            console.log('tree of king')
        }

    } else if (remainingHand.length === 4) {
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

console.log(sortedGame)


const total =  sortedGame.reduce((value, curValue, index) => {
    return value + (curValue.score * (index + 1))
}, 0)

console.log(`TOTAL: ${total}`)
