#!/usr/bin/env node
'use strict';
const fs = require('fs');
const yargs = require('yargs');

var main = async () => {
    var argv = yargs
        .option('size', {
            alias: 's',
            description: 'Size in bytes for the fake image',
            default: '1000',
            type: 'int'
        })
        .option('number', {
            alias: 'c',
            description: 'Numero di file da generare',
            default: '1',
            type: 'int'
        })
        .option('name', {
            alias: 'n',
            description: 'Nome del file',
            default: 'image',
            type: 'string'
        })
        .option('extension', {
            alias: 'e',
            description: 'Extension to generate the image. Available options are `jpg` and `png`',
            default: 'jpg',
            type: 'string'
        })
        .option('output', {
            alias: 'o',
            description: 'Output path for the fake image',
            default: 'C:',
            type: 'string'
        })
        .help()
        .alias('help', 'h')
        .argv;

    var fd = await readFile(argv.extension);
    var buffer = await readIntoBuffer(fd);
    var arrByte = copyToByteArray(buffer, argv.size);
    await saveFile(arrByte, argv.output, argv.extension);
}

var readFile = async (extension) => {
    return new Promise((resolve, reject) => {
        fs.open(`${__dirname}/Untitled.${extension}`, 'r', (err, fd) => {
            handleError(reject, err);

            resolve(fd);
        });
    }).catch((error) => {
        console.error(error);
    });
}

var readIntoBuffer = async (fd) => {
    return new Promise((resolve, reject) => {
        var buffer = Buffer.alloc(600);
        fs.read(fd, buffer, 0, 600, 0, (err, _) => {
            handleError(reject, err);

            resolve(buffer);
        });
    }).catch((error) => {
        console.error(error);
    });
}

var copyToByteArray = (buffer, size) => {
    var arrByte = new Uint8Array(size);

    for (var i = 0; i < buffer.length; i++) {
        arrByte[i] = buffer[i];
    }

    return arrByte;
}

var saveFile = async (arrByte, output, extension) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(`${output}/image.${extension}`, arrByte, (err) => {
            handleError(reject, err);
            resolve();
        });
    }).catch((error) => {
        console.error(error);
    });
}

var handleError = (reject, err) => {
    if (err) {
        reject();
    }
}

(async () => {
    await main();
})();
