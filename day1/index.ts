import * as fs from 'fs';
import * as path from 'path';

const NUMBER_MAPPING: any = {
    one: 'o1e',
    two: 't2o',
    three: 't3e',
    four: 'f4r',
    five: 'f5e',
    six: 's6x',
    seven: 's7n',
    eight: 'e8t',
    nine: 'n9e',
}

const input = fs.readFileSync(path.join(__dirname, 'input.txt')).toString();

const lines = input.split('\n');

const result = lines.map((line: string) => {
    for (const n in NUMBER_MAPPING) {
        const value = NUMBER_MAPPING[n]
        line = line.replaceAll(n, value)
    }

    return Array.from(line).filter(Number)
}).reduce((currentValue: number, numbers: string[]) => {
    const number = `${numbers.at(0)}${numbers.at(-1)}`
    return Number(number) + currentValue
}, 0)

console.log(result)
