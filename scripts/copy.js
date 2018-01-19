var fs = require('fs-extra')
var path = require('path')

var PACKAGE_NAME = 'documentation-theme'
var COPY_FOLDER = 'theme'

var copy = function(dir) {
    var copyFolder = path.join(process.cwd(), dir, COPY_FOLDER)
    console.log('Copying theme files to:', copyFolder)

    return fs.copy(
        path.join(process.cwd(), 'node_modules', PACKAGE_NAME, COPY_FOLDER),
        copyFolder
    )
    .then(function () {
        console.log('Copy success')
    })
    .catch(function (e) {
        console.error('Failed to copy theme files')
        console.error(e)
        process.exit(1)
    })
}

module.exports = copy

