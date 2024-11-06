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
    command: "play",
    describe: "Играть в игру \"Орёл или решка\"",
    builder: {
        logfile: {
            describe: "Имя лог-файла",
            demandOption: true,
            type: "string",
        },
        clearLog: {
            describe: "Очищать лог-файл перед началом игры",
            demandOption: false,
            type: "boolean",
            default: false
        },
    },
    handler: (argv) => {
        // const reader = fs.createReadStream(argv.logfile)
        const writer = fs.createWriteStream(argv.logfile)
        // reader.pipe(writer)
        if (!argv.clearLog) { 
            if (fs.existsSync(argv.logfile)) { 
                writer.write(fs.readFileSync(argv.logfile));
            }
        }
        const handleAnswer = (answer) => {
            const correctAnswer = Math.floor(Math.random() * 2) + 1;
            if (!answer) {
                rl.question(`Угадай 1 или 2\n`, (answer) => {
                    handleAnswer(answer);
                });
                return;
            }
            if (answer === 'exit') {
                writer.close();
                rl.close();
                return;
            }
            if (answer !== '1' && answer !== '2') {
                console.log(`Только 1 или 2!`);
                handleAnswer();
                return;
            }
            if (parseInt(answer) === correctAnswer) {
                console.log(`Угадали!\n`);
                writer.write('win\n');
            } else {
                console.log(`Не угадали!\n`);
                writer.write('lose\n');
            }
            handleAnswer();
        }
        handleAnswer();
    }
}).check((argv) => {
    if (!argv.logfile) {
        throw new Error("Необходимо указать имя лог-файла");
    }
    return true;
} ).demandCommand().parse()
