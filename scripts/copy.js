#!/usr/bin/env node

var fs = require('fs-extra');
var path = require('path');

var PACKAGE_NAME = 'documentation-theme';
var COPY_FOLDER = 'theme';

fs.copy(
    path.join('node_modules', PACKAGE_NAME, COPY_FOLDER),
    path.join('docs', 'public', COPY_FOLDER)
)
.then(function() {
    console.log('Copy success');
})
.catch(function(e) {
    console.error(e);
});
