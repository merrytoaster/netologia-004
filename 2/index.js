#!/usr/bin/env node
const yargs = require("yargs");
const readline = require('node:readline');
const fs = require('node:fs');
const {
    stdin: input,
    stdout: output,
    argv,
} = require('node:process');

const rl = readline.createInterface({ input, output });

yargs.showHelpOnFail(true).command( {command: '*', handler:() => {
    yargs.showHelp()
}}).command({
    command: "analyze",
    describe: "Проанализировать лог файл",
    builder: {
        logfile: {
            describe: "Имя лог-файла",
            demandOption: true,
            type: "string",
        },
    },
    handler: (argv) => {
        if (fs.existsSync(argv.logfile)) { 
           const content = fs.readFileSync(argv.logfile);
           const lines = content.toString().split('\n');
           let winCount = 0;
           let loseCount = 0;
           for (const line of lines) {
               if (line === 'win') {
                   winCount++;
               } else if (line === 'lose') {
                   loseCount++;
               }
           }
           console.log(`Всего партий: ${winCount + loseCount}`);
           console.log(`Всего побед: ${winCount}`);
           console.log(`Всего поражений: ${loseCount}`);
           console.log(`Процент побед: ${((winCount / (winCount + loseCount)) * 100).toFixed(2)}%`); 
        } else {
            console.log(`Лог-файл ${argv.logfile} не существует`);
        }
        process.exit(1);
    }
}).check((argv) => {
    if (!argv.logfile) {
        throw new Error("Необходимо указать имя лог-файла");
    }
    return true;
} ).demandCommand().parse()
