import fs from "fs";
import path from "path";

const input = fs.readFileSync(path.join(__dirname, 'input.txt')).toString();

const lines = input.split(',');

let total = 0
for (const line of lines) {
    let totalOfLine = 0

    for (let i = 0; i < line.length; i++) {
        let ascii = line.charCodeAt(i);
        totalOfLine += ascii
        totalOfLine *= 17
        totalOfLine %= 256
    }

    total += totalOfLine

}

console.log(total)