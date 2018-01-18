#!/usr/bin/env node

var fs = require('fs-extra');
var path = require('path');

var args = process.argv.slice(2);

fs.symlink('latest', `./docs/public/${args[0]}`, 'dir', function(err) {
    if (err) console.error(err);

    console.log('Symlink creation successful.');
});
