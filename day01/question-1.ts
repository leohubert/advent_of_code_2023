import * as fs from 'fs';
import * as path from 'path';

const input = fs.readFileSync(path.join(__dirname, 'input.txt')).toString();

const lines = input.split('\n');

const result = lines.map((line: string) => {
    return Array.from(line).filter(Number)
}).reduce((currentValue: number, numbers: string[]) => {
    const number = `${numbers.at(0)}${numbers.at(-1)}`
    return Number(number) + currentValue
}, 0)

console.log(result)
