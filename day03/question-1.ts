import fs from "fs";
import path from "path";
import _ from 'lodash'

function debug(...args) {
    console.log(...args)
}

const input = fs.readFileSync(path.join(__dirname, 'input.txt')).toString();

const lines = input.split('\n');

function isSpecialChar(char: string) {
    if (char.length > 1) {
        throw new Error(`Bad request, char length > 1 (actual: ${char.length}`)
    }
    return char !== '.' && !isNumeric(char)
}

function isNumeric(char: string) {
    if (char.length > 1) {
        throw new Error(`Bad request, char length > 1 (actual: ${char.length}`)
    }
    return !_.isNaN(Number(char))
}


function lookAround(from: number, to: number, lineIndex: number): boolean {
    const maxLineLength = lines[lineIndex].length - 1
    const safeFrom = from == 0 ? from : from - 1
    const safeTo = to == maxLineLength ? to : to + 1


    if (lineIndex !== 0) {
        const lineBefore = lines[lineIndex - 1];

        for (let i = safeFrom; i <= safeTo; i++) {
            const char = lineBefore[i]
            debug('charB', char);
            if (isSpecialChar(char)) {
                return true
            }
        }
    }


    const currentLine = lines[lineIndex];

    for (let i = safeFrom; i <= safeTo; i++) {
        const char = currentLine[i]
        debug('charC', char);
        if (isSpecialChar(char)) {
            return true
        }
    }

    if (lineIndex != lines.length - 1) {

        const nextLine = lines[lineIndex + 1];

        for (let i = safeFrom; i <= safeTo; i++) {
            const char = nextLine[i]
            debug('charN', char);
            if (isSpecialChar(char)) {
                return true
            }
        }
    }

    return false
}


let excludedNb = []
let total = 0
for (const [lineIndex, line] of lines.entries()) {
    let curNumber = ''
    let curNumberFrom = null
    let curNumberTo = null
    for (const [charIndex, char] of Array.from(line).entries()) {
        if (isNumeric(char)) {
            curNumber = `${curNumber}${char}`
            if (curNumberFrom === null) {
                curNumberFrom = charIndex
                curNumberTo = charIndex
            } else {
                curNumberTo = charIndex
            }
        }

        if (!isNumeric(char) || charIndex == line.length - 1) {
            if (curNumberFrom != null && curNumberTo != null) {
                // check around
                console.log('curNum', curNumber, curNumberFrom, curNumberTo, lineIndex)
                if (lookAround(curNumberFrom, curNumberTo, lineIndex)) {
                    total += Number(curNumber)
                } else {
                    excludedNb.push(curNumber)
                }


                curNumber = ''
                curNumberFrom = null
                curNumberTo = null
            }
        }
        // console.log(charIndex, char)
    }
}


console.log(total)
