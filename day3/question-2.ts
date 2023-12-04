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

function extractNumber(charIndex: number, lineIndex: number) {
    let number = ''
    const line = lines[lineIndex]
    const maxLineLength = lines[lineIndex].length - 1
    console.log(charIndex, lineIndex)

    while (true) {
        if (charIndex == 0 || !isNumeric(line[charIndex - 1])) {
            break
        }
        charIndex--;
    }

    while (isNumeric(line[charIndex])) {
        number = `${number}${line[charIndex]}`
        if (charIndex + 1 > maxLineLength) {
            break
        }
        charIndex++
    }

    return number
}


function lookAround(grearIndex: number, lineIndex: number): string[] {
    const maxLineLength = lines[lineIndex].length - 1
    const safeFrom = grearIndex == 0 ? grearIndex : grearIndex - 1
    const safeTo = grearIndex == maxLineLength ? grearIndex : grearIndex + 1

    const numbersFound: string[] = []

    if (lineIndex !== 0) {
        const lineBefore = lines[lineIndex - 1];

        for (let i = safeFrom; i <= safeTo; i++) {
            const char = lineBefore[i]
            debug('charB', char);
            if (isNumeric(char)) {
                numbersFound.push(extractNumber(i, lineIndex - 1))
            }
        }
    }


    const currentLine = lines[lineIndex];

    for (let i = safeFrom; i <= safeTo; i++) {
        const char = currentLine[i]
        debug('charC', char);
        if (isNumeric(char)) {
            numbersFound.push(extractNumber(i, lineIndex))
        }
    }

    if (lineIndex != lines.length - 1) {

        const nextLine = lines[lineIndex + 1];

        for (let i = safeFrom; i <= safeTo; i++) {
            const char = nextLine[i]
            debug('charN', char);
            if (isNumeric(char)) {
                numbersFound.push(extractNumber(i, lineIndex + 1))
            }
        }
    }

    return _.uniq(numbersFound)
}


let total = 0
for (const [lineIndex, line] of lines.entries()) {
    for (const [charIndex, char] of Array.from(line).entries()) {
        if (char === '*') {
           const res = lookAround(charIndex, lineIndex)
            if (res.length === 2) {
                total += Number(res[0]) * Number(res[1])
            } else if (res.length > 2) {
                throw new Error('ccc')
            }
        }
    }
}


console.log(total)
