import fs from "fs";
import path from "path";

const input = fs.readFileSync(path.join(__dirname, 'input.txt')).toString();

const lines = input.split(',');

function calculHash(str: string) {
    let totalOfLine = 0

    for (let i = 0; i < str.length; i++) {
        let ascii = str.charCodeAt(i);
        totalOfLine += ascii
        totalOfLine *= 17
        totalOfLine %= 256
    }

    return totalOfLine
}

const boxes = new Array(256)

for (const line of lines) {

    if (line.indexOf('=') != -1) {
        const [str, lenght] = line.split('=')
        const boxIndex = calculHash(str)

        if (!boxes[boxIndex]) {
            boxes[boxIndex] = []
        }

        const indexOfExistingBox = boxes[boxIndex].findIndex(box => box.str === str)
        if (indexOfExistingBox !== -1) {
            boxes[boxIndex][indexOfExistingBox] = {
                str,
                size: lenght
            }
        } else {
            boxes[boxIndex].push({
                str,
                size: lenght
            })
        }
    } else if (line.indexOf('-') != -1) {
        const [str] = line.split('-')
        const boxIndex = calculHash(str)

        if (!boxes[boxIndex]) {
            continue
        }

        const indexOfExistingBox = boxes[boxIndex].findIndex(box => box.str === str)
        if (indexOfExistingBox !== -1) {
            boxes[boxIndex].splice(indexOfExistingBox, 1)
        }
    }


}

let total = 0
for (const [boxIndex, slots] of boxes.entries()) {

    if (!slots) {
        continue
    }

    const boxNumber = boxIndex + 1


    for (const [slotIndex, slot] of slots.entries()) {
        const slotNumber = slotIndex + 1
        total += boxNumber * slotNumber * slot.size
    }

}

console.log(total)