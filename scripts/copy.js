#!/usr/bin/env node

var fs = require('fs-extra');
var path = require('path');

var PACKAGE_NAME = 'documentation-theme';
var COPY_FOLDER = 'theme';

var args = process.argv.slice(2);

if (args.length < 1) {
    console.error('usage: theme-copy-files destination/folder')
    console.error('The destination folder should be the path to your documentation version folder, e.g. "public/docs/dev"');
    process.exit(1);
} else {
    var copyFolder = path.join(args[0], COPY_FOLDER)
    console.log('Copying theme files to:', copyFolder)
}

fs.copy(
    path.join('node_modules', PACKAGE_NAME, COPY_FOLDER),
    copyFolder
)
    .then(function () {
        console.log('Copy success');
    })
    .catch(function (e) {
        console.error('Failed to copy theme')
        console.error(e);
        process.exit(1)
    });
