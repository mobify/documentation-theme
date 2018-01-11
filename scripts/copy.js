#!/usr/bin/env node

var fs = require('fs-extra');
var path = require('path');

var PACKAGE_NAME = 'documentation-theme';
var COPY_FOLDER = 'theme';

var args = process.argv.slice(2);

var copyFolder = path.join('docs', 'public', COPY_FOLDER)

if (args.length > 0) {
    copyFolder = args[0]
    console.log('Using custom destination for theme files:', copyFolder)
}

fs.copy(
    path.join('node_modules', PACKAGE_NAME, COPY_FOLDER),
    copyFolder
)
.then(function() {
    console.log('Copy success');
})
.catch(function(e) {
    console.error('Failed to copy theme')
    console.error(e);
    process.exit(1)
});
