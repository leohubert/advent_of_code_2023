import fs from "fs";
import path from "path";

const input = fs.readFileSync(path.join(__dirname, 'input.txt')).toString();

const lines = input.split('\n');